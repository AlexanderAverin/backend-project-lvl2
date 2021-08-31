import stylish from './stylish/visual.js';
import plain from './plain/plain.js';

const getRender = (format) => {
  switch (format) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      return stylish;
  }
};

export default getRender;
