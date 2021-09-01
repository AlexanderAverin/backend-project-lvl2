import { test, expect, beforeEach, beforeAll } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '../', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let JsonPath1;
let JsonPath2;

let YamlPath1;
let YamlPath2;

let resultForStylishFormat;
let resultForPlainFormat;
let resultForJsonFormat;

beforeEach(() => {
  JsonPath1 = getFixturePath('file1.json');
  JsonPath2 = getFixturePath('file2.json');

  YamlPath1 = getFixturePath('file1.yml');
  YamlPath2 = getFixturePath('file2.yml');

  resultForStylishFormat = readFile('resultForStylishFormat.txt');
  // resultForStylishFormat = readFile('result_stylish.txt');

  resultForPlainFormat = readFile('resultForPlaneFormat.txt');
  // resultForPlainFormat = readFile('result_plain.txt');

  resultForJsonFormat = readFile('resultForJsonFormat.txt');
});

test('gendiff test', () => {
  expect(genDiff(JsonPath1, JsonPath2)).toEqual(resultForStylishFormat);
  expect(genDiff(YamlPath1, YamlPath2)).toEqual(resultForStylishFormat);
  expect(genDiff(JsonPath1, YamlPath2)).toEqual(resultForStylishFormat);

  expect(genDiff(JsonPath1, JsonPath2, 'plain')).toEqual(resultForPlainFormat);

  expect(genDiff(JsonPath1, JsonPath2, 'json')).toEqual(resultForJsonFormat);
});
