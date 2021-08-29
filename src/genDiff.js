import generateAst from './parser.js';
import render from './renders/visual.js';

const genDiff = (file1, file2) => {
  const Ast = generateAst(file1, file2);
  // return Ast;
  const renderTree = render(Ast);
  return renderTree;
};

export default genDiff;
