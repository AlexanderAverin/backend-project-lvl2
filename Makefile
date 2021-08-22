lint: 
	npx eslint .

publish:
	npm publish --dry-run

gendiff:
	node bin/gendiff.js

test:
	npm test

test-coverage:
	node --experimental-vm-modules "node_modules/.bin/jest" --coverage