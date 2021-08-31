import generateAst from './parser.js';
import stylishRender from './renders/visual.js';

const getRender = (format) => {
  switch (format) {
    case 'stylish':
      return stylishRender;
    default:
      return stylishRender;
  }
};

const genDiff = (file1, file2, format = 'stylish') => {
  const Ast = generateAst(file1, file2);
  const render = getRender(format);
  // return Ast;
  const renderTree = render(Ast);
  return renderTree;
};

export default genDiff;
