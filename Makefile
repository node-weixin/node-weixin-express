run:
	gulp run
	node dist/cli.js
test:
	gulp prepublish
	gulp
release:
	gulp prepublish
	gulp
	npm publish
clean:
	rm -rf dist
	rm -rf coverage
