import _ from 'lodash';

const generateChild = (name, inFile1, inFile2, children, status, handler) => {
  const child = {
    name, inFile1, inFile2, children, status, handler,
  };
  return child;
};
const mergeKeys = (obj1, obj2) => [...Object.keys(obj1), ...Object.keys(obj2)];

const Unchanged = (key, obj1, obj2) => (_.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key] ? 'unchanged' : false);

const Deleted = (key, obj1, obj2) => (_.has(obj1, key) && obj1[key] !== obj2[key] ? 'deleted' : false);

const Added = (key, obj1, obj2) => (_.has(obj2, key) && obj1[key] !== obj2[key] ? 'added' : false);

const getStatsMap = (key, obj1, obj2) => (func) => (func2) => (func3) => ({
  unchanged: func(key, obj1, obj2),
  added: func2(key, obj1, obj2),
  deleted: func3(key, obj1, obj2),
});

const getKeyStatus = (key, obj1, obj2) => {
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

const parse = (obj1, obj2) => {
  const keys = mergeKeys(obj1, obj2);
  const tree = {};

  const iter = (mergedKeys) => mergedKeys.reduce((acc, key) => {
    const children = !_.isObject(obj1[key]) && !_.isObject(obj2[key])
      ? [] : parse(obj1[key], obj2[key]);

    return [...acc, generateChild(
      key, obj1[key], obj2[key], children, getKeyStatus(key, obj1, obj2), 'function',
    )];
  }, []);
  tree.children = iter(keys);
  return tree;
};

export default parse;
