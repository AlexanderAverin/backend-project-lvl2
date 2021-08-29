import _ from 'lodash';

const getChildren = (node) => node.children;

const addBrackets = (str) => `{\n${str}\n}`;

const renderNode = (node) => {
  const select = {
    unchanged: () => (`    ${node.name}: ${node.inFile1}`),
    deleted: () => (`  - ${node.name}: ${node.inFile1}`),
    changed: () => ([`  - ${node.name}: ${node.inFile1}`,
      `  + ${node.name}: ${node.inFile2}`]),
    added: () => (`  + ${node.name}: ${node.inFile2}`),
  };
  return select[node.type]();
};

const render = (tree) => addBrackets(_.sortBy(tree, (node) => node.name)
  .flatMap((node) => renderNode(node))
  .join('\n'));

export default render;
