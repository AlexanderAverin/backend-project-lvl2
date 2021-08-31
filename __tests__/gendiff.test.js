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

let flatJsonData1;
let flatJsonData2;

let nestJsonData1;
let nestJsonData2;

let flatYamlData1;
let flatYamlData2;

let nestYamlData1;
let nestYamlData2;

let resultForFlatFiles;
let resultForNestedFiles;

beforeEach(() => {
  flatJsonData1 = JSON.parse(readFile('flatFiles/file1.json'));
  flatJsonData2 = JSON.parse(readFile('flatFiles/file2.json'));

  nestJsonData1 = JSON.parse(readFile('nestedFiles/file1.json'));
  nestJsonData2 = JSON.parse(readFile('nestedFiles/file2.json'));

  flatYamlData1 = yaml.load(readFile('flatFiles/file1.yaml'));
  flatYamlData2 = yaml.load(readFile('flatFiles/file2.yaml'));

  nestYamlData1 = yaml.load(readFile('nestedFiles/file1.yaml'));
  nestYamlData2 = yaml.load(readFile('nestedFiles/file2.yaml'));

  resultForNestedFiles = readFile('nestedFiles/result.txt');
  resultForFlatFiles = readFile('flatFiles/result.txt');
});

test('gendiff test', () => {
  expect(genDiff(flatJsonData1, flatJsonData2)).toEqual(resultForFlatFiles);
  expect(genDiff(flatYamlData1, flatYamlData2)).toEqual(resultForFlatFiles);

  expect(genDiff(nestJsonData1, nestJsonData2)).toEqual(resultForNestedFiles);
  expect(genDiff(nestYamlData1, nestYamlData2)).toEqual(resultForNestedFiles);
});
