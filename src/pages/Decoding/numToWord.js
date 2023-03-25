import numWords from 'num-words';

const convertNumberToWords = (input) => {
  return input.replace(/\d+/g, (number) => numWords(number));
};

export default convertNumberToWords;