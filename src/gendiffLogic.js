import { Command } from 'commander/esm.mjs';

const programm = new Command();

programm
  .version('output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('filepath1 filepath2');

programm.parse(process.argv);

export default programm;
