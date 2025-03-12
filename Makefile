.PHONY: serve build capsync lint test e2e check clean install pwa android ios ios-live android-live

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
	ionic serve

build:
	ng build

capsync:
	ng build && appflow live-update generate-manifest --build-dir=www && npx ionic cap sync --no-build

lint:
	npm run lint

test:
	npm run test

e2e:
	npm run e2e

check: test lint

# Deployment targets
pwa:
	ionic build --prod

android:
	ionic cordova run android --prod

ios:
	ionic cordova run ios --prod

# Live reload development on devices
ios-live:
	echo "Make sure you have Xcode installed!"
	npx ionic cap run ios --livereload --external

android-live:
	echo "Make sure you have Android Studio installed!"
	npx ionic cap sync android
	npx ionic cap open android

clean:
	rm -rf www/
	rm -rf .angular/
	rm -rf node_modules/
