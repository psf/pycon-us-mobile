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
	npx ionic serve

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
	echo "Make sure you have Xcode installed!"
	npx ionic cap run ios --livereload --external

android-live:
	echo "Make sure you have Android Studio installed!"
	npx ionic cap run android --livereload --external

clean:
	rm -rf www/
	rm -rf .angular/
	rm -rf node_modules/
