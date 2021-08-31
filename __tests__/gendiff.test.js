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

let resultForStylishFlatFiles;
let resultForStylishNestedFiles;

let resultForPlainNestedFiles;

let resultForJsonNestedFiles;

beforeEach(() => {
  flatJsonData1 = JSON.parse(readFile('flatFiles/file1.json'));
  flatJsonData2 = JSON.parse(readFile('flatFiles/file2.json'));

  nestJsonData1 = JSON.parse(readFile('nestedFiles/file1.json'));
  nestJsonData2 = JSON.parse(readFile('nestedFiles/file2.json'));

  flatYamlData1 = yaml.load(readFile('flatFiles/file1.yaml'));
  flatYamlData2 = yaml.load(readFile('flatFiles/file2.yaml'));

  nestYamlData1 = yaml.load(readFile('nestedFiles/file1.yaml'));
  nestYamlData2 = yaml.load(readFile('nestedFiles/file2.yaml'));

  resultForStylishNestedFiles = readFile('nestedFiles/resultForStylishFormat.txt');
  resultForStylishFlatFiles = readFile('flatFiles/resultForStylishFormat.txt');

  resultForPlainNestedFiles = readFile('nestedFiles/resultForPlaneFormat.txt');

  resultForJsonNestedFiles = readFile('nestedFiles/resultForJsonFormat.txt');
});

test('gendiff test', () => {
  expect(genDiff(flatJsonData1, flatJsonData2)).toEqual(resultForStylishFlatFiles);
  expect(genDiff(flatYamlData1, flatYamlData2)).toEqual(resultForStylishFlatFiles);

  expect(genDiff(nestJsonData1, nestJsonData2)).toEqual(resultForStylishNestedFiles);
  expect(genDiff(nestYamlData1, nestYamlData2)).toEqual(resultForStylishNestedFiles);

  expect(genDiff(nestJsonData1, nestJsonData2, 'plain')).toEqual(resultForPlainNestedFiles);

  expect(genDiff(nestJsonData1, nestJsonData2, 'json')).toEqual(resultForJsonNestedFiles);
});
