lint: 
	npx eslint .

publish:
	npm publish --dry-run

gendiff:
	node bin/gendiff.js

test:
	npm test

test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage