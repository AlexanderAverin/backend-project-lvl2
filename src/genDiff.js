import { cwd } from 'process';
import path from 'path';
import * as fs from 'fs';
import yaml from 'js-yaml';
import generateAst from './parser.js';
import getRender from './formatters/index.js';

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

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const pathToFile1 = path.resolve(cwd(filepath1), filepath1);
  const pathToFile2 = path.resolve(cwd(filepath1), filepath2);

  const fileObject1 = convertToObject(pathToFile1);
  const fileObject2 = convertToObject(pathToFile2);

  const Ast = generateAst(fileObject1, fileObject2);
  const render = getRender(format);
  // return Ast[3];
  const renderTree = render(Ast);
  return renderTree;
};

export default genDiff;
