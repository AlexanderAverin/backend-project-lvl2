#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';

import * as fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import genDiff from '../src/genDiff.js';

const programm = new Command();

const isJson = (filepath) => path.extname(filepath) === '.json';

// const isYaml = (filepath) => path.extname(filepath) === '.yaml';

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
      const parsedFile = fs.readFileSync(pathToFile, 'utf8');
      const parsedFile2 = fs.readFileSync(pathToFile2, 'utf8');
      console.log(genDiff(JSON.parse(parsedFile), JSON.parse(parsedFile2)));
    }
  });

programm.parse(process.argv);
