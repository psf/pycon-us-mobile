.PHONY: serve build capsync lint test e2e check clean install pwa android ios ios-live android-live appflow-ship

default:
	@echo "Call a specific subcommand:"
	@echo
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null\
	| awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}'\
	| sort\
	| egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
	@echo
	@exit 1

install:
	npm install

serve:
	@echo "Starting server in development mode..."
	npx ionic serve --configuration=development

build:
	npx ng build

capsync:
	npm run capsync

lint:
	npm run lint

test:
	npm run test

e2e:
	npm run e2e

check: test lint

# Deployment targets
pwa:
	npx ionic build --prod

android:
	npx ionic cap run android --prod

ios:
	npx ionic cap run ios --prod

# Live reload development on devices
ios-live:
	@echo "Make sure you have Xcode installed!"
	npx ionic cap run ios --livereload --external

android-live:
	@echo "Make sure you have Android Studio installed!"
	npx ionic cap run android --livereload --external

clean:
	rm -rf www/
	rm -rf .angular/
	rm -rf node_modules/

# Push current main to GitHub, build the web bundle on Appflow, and deploy it
# to the Production live-update channel. Requires:
#   - IONIC_TOKEN env var (Appflow personal access token)
#   - jq installed
# After build the jq selector below may need tweaking once you see the actual
# JSON shape; if so, run `appflow build web --json | jq .` once and update.
APPFLOW_APP_ID := e8e09c7a
APPFLOW_CHANNEL := Production

appflow-ship:
	@command -v appflow >/dev/null || (echo "appflow CLI not found; install with: npm install -g @ionic/cloud-cli" && exit 1)
	@command -v jq >/dev/null || (echo "jq not found; brew install jq" && exit 1)
	@test -n "$$IONIC_TOKEN" || (echo "IONIC_TOKEN not set (export from .env: set -x IONIC_TOKEN (grep IONIC_TOKEN .env | cut -d= -f2))" && exit 1)
	@COMMIT=$$(git rev-parse HEAD); \
	if [ -z "$$(git branch -r --contains $$COMMIT 2>/dev/null)" ]; then \
		echo "ERROR: $$COMMIT is not on any remote branch yet. Push it first (e.g. 'git push origin HEAD')."; \
		exit 1; \
	fi; \
	echo ">> Building $(APPFLOW_APP_ID) @ $$COMMIT on Appflow..."; \
	BUILD_JSON=$$(appflow build web --app-id $(APPFLOW_APP_ID) --commit $$COMMIT --json); \
	BUILD_ID=$$(echo "$$BUILD_JSON" | jq -r '.buildId // .build_id // .id'); \
	if [ -z "$$BUILD_ID" ] || [ "$$BUILD_ID" = "null" ]; then \
		echo "Could not parse build ID from response:"; echo "$$BUILD_JSON"; exit 1; \
	fi; \
	echo ">> Built #$$BUILD_ID. Deploying to $(APPFLOW_CHANNEL)..."; \
	appflow deploy web --app-id $(APPFLOW_APP_ID) --build-id $$BUILD_ID --destination $(APPFLOW_CHANNEL); \
	echo ">> Done. Existing app installs will pick up build #$$BUILD_ID on next cold launch."
