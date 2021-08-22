import _ from 'lodash';

import parse from './parsers/parse.js';

const getSymbolStat = (status) => {
  switch (status) {
    case 'unchanged':
      return { firstStatus: ' ', secondStatus: ' ' };
    case 'deleted':
      return { firstStatus: '-', secondStatus: '+' };
    case 'added':
      return { firstStatus: '+', secondStatus: '-' };
    default: return { firstStatus: ' ', secondStatus: '' };
  }
};

const getChildren = (tree) => tree.children;

const getString = (status, name, value) => `  ${status} ${name}: ${value}`;

const render = (tree) => _.sortBy(getChildren(tree), (child) => child.name)
  .reduce((acc, child) => {
    const { firstStatus, secondStatus } = getSymbolStat(child.status);
    const { name, inFile1, inFile2 } = child;

    const str = getString(firstStatus, name, inFile1 ?? inFile2);
    const str2 = inFile1 && inFile2 && inFile1 !== inFile2
      ? getString(secondStatus, name, inFile2) : [];

    return !acc.includes(str) ? [...acc, str, str2] : [...acc];
  }, []).flat().join('\n');

const genDiff = (file1, file2) => {
  const tree = parse(file1, file2);
  const renderTree = render(tree);
  return `{\n${renderTree}\n}`;
};

export default genDiff;
