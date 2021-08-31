import stylish from './stylish/visual.js';
import plain from './plain/plain.js';
import jsonFormater from './json/json.js';

const getRender = (format) => {
  switch (format) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    case 'json':
      return jsonFormater;
    default:
      return stylish;
  }
};

export default getRender;
