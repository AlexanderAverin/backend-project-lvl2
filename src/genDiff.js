import _ from 'lodash';

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

const getChild = (name, inFile1, inFile2, children, status) => {
  const child = {
    name, inFile1, inFile2, children, status,
  };
  return child;
};

const getString = (status, name, value) => `  ${status} ${name}: ${value}`;

const mergeKeys = (obj1, obj2) => [...Object.keys(obj1), ...Object.keys(obj2)];

const Unchanged = (key, obj1, obj2) => (_.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key] ? 'unchanged' : false);

const Deleted = (key, obj1, obj2) => (_.has(obj1, key) && obj1[key] !== obj2[key] ? 'deleted' : false);

const Added = (key, obj1, obj2) => (_.has(obj2, key) && obj1[key] !== obj2[key] ? 'added' : false);

const getStatsMap = (key, obj1, obj2) => (func) => (func2) => (func3) => ({
  unchanged: func(key, obj1, obj2),
  added: func2(key, obj1, obj2),
  deleted: func3(key, obj1, obj2),
});

const handler = (key, obj1, obj2) => {
  const statsMap = getStatsMap(key, obj1, obj2)(Unchanged)(Deleted)(Added);
  const runner = (keys) => {
    const firstItem = keys[0];
    if (statsMap[firstItem]) {
      return statsMap[firstItem];
    }
    return runner(keys.slice(1, keys.length));
  };
  return runner(Object.keys(statsMap));
};

const generateTree = (obj1, obj2) => {
  const keys = mergeKeys(obj1, obj2);
  const tree = {};

  const iter = (mergedKeys) => mergedKeys.reduce((acc, key) => {
    const children = !_.isObject(obj1[key]) && !_.isObject(obj2[key])
      ? [] : generateTree(obj1[key], obj2[key]);

    return [...acc, getChild(key, obj1[key], obj2[key], children, handler(key, obj1, obj2))];
  }, []);
  tree.children = iter(keys);
  return tree;
};

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
  const tree = generateTree(file1, file2);
  const renderTree = render(tree);
  return `{\n${renderTree}\n}`;
};

export default genDiff;
