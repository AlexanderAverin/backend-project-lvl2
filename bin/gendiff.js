#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';

import * as fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import yaml from 'js-yaml';
import genDiff from '../src/genDiff.js';

const programm = new Command();

const isJson = (filepath) => path.extname(filepath) === '.json';

const isYaml = (filepath) => path.extname(filepath) === '.yaml' || path.extname(filepath) === '.yml';

programm
  .version('output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('filepath1 filepath2')

  .action((filepath1, filepath2) => {
    const DirectoryPath = cwd(filepath1);
    const DirectoryPath2 = cwd(filepath2);

    const pathToFile = path.resolve(DirectoryPath, filepath1);
    const pathToFile2 = path.resolve(DirectoryPath2, filepath2);

    if (isJson(pathToFile) && isJson(pathToFile)) {
      const parsedJson1 = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
      const parsedJson2 = JSON.parse(fs.readFileSync(pathToFile2, 'utf8'));
      console.log(genDiff(parsedJson1, parsedJson2));
    }

    if (isYaml(pathToFile) && isYaml(pathToFile2)) {
      const parsedYaml1 = yaml.load(fs.readFileSync(pathToFile));
      const parsedYaml2 = yaml.load(fs.readFileSync(pathToFile2));
      console.log(genDiff(parsedYaml1, parsedYaml2));
    }
  });

programm.parse(process.argv);
