import generateAst from './parser.js';
import getRender from './formatters/index.js';

const genDiff = (file1, file2, format = 'stylish') => {
  const Ast = generateAst(file1, file2);
  const render = getRender(format);
  // return Ast;
  const renderTree = render(Ast);
  return renderTree;
};

export default genDiff;
