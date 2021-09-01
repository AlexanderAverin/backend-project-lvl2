import { test, expect } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '../', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('gendiff test', () => {
  const resultForStylishFormat = readFile('resultForStylishFormat.txt');
  const resultForPlainFormat = readFile('resultForPlaneFormat.txt');
  const resultForJsonFormat = readFile('resultForJsonFormat.txt');

  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(resultForStylishFormat);
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.yml'))).toEqual(resultForStylishFormat);

  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'plain')).toEqual(resultForPlainFormat);

  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'json')).toEqual(resultForJsonFormat);
});
