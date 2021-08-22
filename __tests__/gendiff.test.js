import { test, expect, beforeEach } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import yaml from 'js-yaml';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let JsonData1;
let JsonData2;

let YamlData1;
let YamlData2;

let result;

beforeEach(() => {
  JsonData1 = JSON.parse(readFile('file1.json'));
  JsonData2 = JSON.parse(readFile('file2.json'));

  YamlData1 = yaml.load(readFile('file1.yaml'));
  YamlData2 = yaml.load(readFile('file2.yaml'));

  result = readFile('result.txt');
});

test('gendiff test', () => {
  expect(genDiff(JsonData1, JsonData2)).toEqual(result);
  expect(genDiff(YamlData1, YamlData2)).toEqual(result);
});
