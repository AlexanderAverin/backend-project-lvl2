import _ from 'lodash';

const getChildren = (node) => node.children;

const hasChildren = (node) => {
  const children = getChildren(node);
  return children.length !== 0;
};

const needGenDiffForChild = (node) => _.isObject(node.inFile1) && _.isObject(node.inFile2);

const addBrackets = (str, tab = '') => `{\n${str}\n${tab}}`;

const getOnlyType = (node) => {
  const typesSymbols = {
    unchanged: () => (' '),
    deleted: () => ('-'),
    added: () => ('+'),
  };
  return typesSymbols[node.type]();
};

const renderNestedNodeWithType = (node, children, tab, type = getOnlyType(node)) => `${tab}${type} ${node.name}: ${children}`;

const renderNestedNode = (node, children, tab) => `${tab}  ${node.name}: ${children}`;

const clearRenderNode = (node, tab) => `${tab}    ${node.name}: ${node.inFile1 ?? node.inFile2}`;

const renderNode = (node, tab) => {
  const select = {
    unchanged: () => (`${tab}    ${node.name}: ${node.inFile1}`),
    deleted: () => (node.inFile1 !== '' ? `${tab}  - ${node.name}: ${node.inFile1}` : `${tab}  - ${node.name}:`),
    changed: () => ([node.inFile1 !== '' ? `${tab}  - ${node.name}: ${node.inFile1}` : `${tab}  - ${node.name}:`,
      node.inFile2 !== '' ? `${tab}  + ${node.name}: ${node.inFile2}` : `${tab}  + ${node.name}:`]),
    added: () => (node.inFile2 !== '' ? `${tab}  + ${node.name}: ${node.inFile2}` : `${tab}  + ${node.name}:`),
  };
  return select[node.type]();
};

const render = (tree, RenderFunction = renderNode, tab = '') => addBrackets(_.sortBy(tree, (node) => node.name)
  .flatMap((node) => {
    const children = getChildren(node);
    const space = '  ';
    const newTab = `${tab}${space}`;
    const tabForNode = `${newTab}${space}`;

    if (node.type === 'nested') {
      if (_.isObject(node.inFile1)) {
        return [
          renderNestedNodeWithType(node, render(children, clearRenderNode, tabForNode), newTab, '-'),
          `${newTab}+ ${node.name}: ${node.inFile2}`,
        ];
      }
      return [
        `${newTab}- ${node.name}: ${node.inFile1}`,
        renderNestedNodeWithType(node, render(children, clearRenderNode, tabForNode), newTab, '+'),
      ];
    }

    if (hasChildren(node) && needGenDiffForChild(node)) {
      return renderNestedNodeWithType(node, render(children, renderNode, tabForNode), newTab);
    }

    if (hasChildren(node) && !needGenDiffForChild(node) && RenderFunction === renderNode) {
      return renderNestedNodeWithType(node, render(children, clearRenderNode, tabForNode), newTab);
    }

    if (hasChildren(node) && !needGenDiffForChild(node)) {
      return renderNestedNode(node, render(children, clearRenderNode, tabForNode), newTab);
    }

    return RenderFunction(node, tab);
  })
  .join('\n'), tab);

export default render;
