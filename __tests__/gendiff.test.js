import { test, expect, beforeEach } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gendiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let fileData1;
let fileData2;
let result;

beforeEach(() => {
  fileData1 = JSON.parse(readFile('file1.json'));
  fileData2 = JSON.parse(readFile('file2.json'));
  result = readFile('result.txt');
});

test('gendiff test', () => {
  expect(gendiff(fileData1, fileData2)).toEqual(result);
});
