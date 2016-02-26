run:
	rm -rf dist
	gulp run
	node dist/cli.js ${ARGS}
test:
	rm -rf dist
	gulp prepublish
	gulp
release:
	rm -rf dist
	gulp
	rm -rf dist
	npm publish
clean:
	rm -rf dist
	rm -rf coverage
