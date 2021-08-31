#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';

import * as fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import yaml from 'js-yaml';
import genDiff from '../src/genDiff.js';

const program = new Command();

const isJson = (filepath) => path.extname(filepath) === '.json';

const isYaml = (filepath) => path.extname(filepath) === '.yaml' || path.extname(filepath) === '.yml';

const convertToObject = (file) => {
  if (isJson(file)) {
    return JSON.parse(fs.readFileSync(file));
  } if (isYaml(file)) {
    return yaml.load(fs.readFileSync(file));
  }
  return JSON.parse(fs.readFileSync(file));
};

program
  .version('output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('filepath1 filepath2')

  .action((filepath1, filepath2) => {
    const pathToFile = path.resolve(cwd(filepath1), filepath1);
    const pathToFile2 = path.resolve(cwd(filepath1), filepath2);

    const fileObject = convertToObject(pathToFile);
    const fileObject2 = convertToObject(pathToFile2);

    const options = program.opts();

    console.log(genDiff(fileObject, fileObject2, options.format));
  });

program.parse(process.argv);
