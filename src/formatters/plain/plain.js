import _ from 'lodash';

const getChildren = (node) => node.children;

const hasChildren = (node) => {
  const children = getChildren(node);
  return children.length !== 0;
};

const needGenDiffForChild = (node) => _.isObject(node.inFile1) && _.isObject(node.inFile2);

const getNewPath = (node, currentPath) => (currentPath === '' ? `${currentPath}${node.name}` : `${currentPath}.${node.name}`);

const getValidValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return _.isString(value) ? `'${value}'` : value;
};

const renderNode = (node, path) => {
  const select = {
    added: () => `Property '${path}' was added with value: ${getValidValue(node.inFile2)}`,
    deleted: () => `Property '${path}' was removed`,
    changed: () => `Property '${path}' was updated. From ${getValidValue(node.inFile1)} to ${getValidValue(node.inFile2)}`,
    unchanged: () => [],
    nested: () => {
      if (node.inFile1 && node.inFile2) {
        return `Property '${path}' was updated. From ${getValidValue(node.inFile1)} to ${getValidValue(node.inFile2)}`;
      }
      if (node.inFile1 && !node.inFile2) {
        return `Property '${path}' was removed`;
      }

      return node.inFile1 && !node.inFile2
        ? `Property '${path}' was removed`
        : `Property '${path}' was added with value: ${getValidValue(node.inFile2)}`;
    },
  };
  return select[node.type]();
};

const plain = (tree, path = '') => _.sortBy(tree, (key) => key.name)
  .flatMap((node) => {
    const NewPath = getNewPath(node, path);

    const children = getChildren(node);
    if (hasChildren(node) && needGenDiffForChild(node)) {
      return plain(children, NewPath);
    }

    return renderNode(node, NewPath);
  })
  .join('\n');

export default plain;
