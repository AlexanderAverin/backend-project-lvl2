import _ from 'lodash';

const mergeKeys = (obj1, obj2 = {}) => [...Object.keys(obj1), ...Object.keys(obj2)]
  .reduce((acc, key) => {
    if (!acc.includes(key)) {
      return [...acc, key];
    }
    return [...acc];
  }, []);

const statusFunctionsObject = {

  deleted: (key, obj1, obj2) => (_.has(obj1, key) && !_.has(obj2, key)),

  changed: (key, obj1, obj2) => (_.has(obj1, key)
    && _.has(obj2, key) && (obj1[key] !== obj2[key])
    && !_.isObject(obj1[key]) && !_.isObject(obj2[key])),

  added: (key, obj1, obj2) => (!_.has(obj1, key) && _.has(obj2, key)),

  // Nested change
  nested: (key, obj1, obj2) => (_.has(obj1, key) && _.has(obj2, key))
  && ((_.isObject(obj1[key]) && !_.isObject(obj2[key]))
  || (!_.isObject(obj1[key]) && _.isObject(obj2[key]))),

  unchanged: (key, obj1, obj2) => (_.has(obj1, key) && _.has(obj2, key)),
};

const getStatus = (key, obj1, obj2) => _.findKey(
  statusFunctionsObject, (status) => status(key, obj1, obj2),
);

const generateAst = (obj1 = {}, obj2 = {}) => {
  const mergedKeys = mergeKeys(obj1, obj2);

  return mergedKeys.map((key) => {
    const newObj1 = _.isObject(obj1[key]) ? obj1[key] : {};
    const newObj2 = _.isObject(obj2[key]) ? obj2[key] : {};

    const children = (Object.keys(newObj1).length !== 0 || Object.keys(newObj2).length !== 0)
      ? generateAst(newObj1, newObj2) : [];

    return {
      name: key,
      inFile1: obj1[key],
      inFile2: obj2[key],
      type: getStatus(key, obj1, obj2),
      children: children || [],
    };
  });
};

export default generateAst;
