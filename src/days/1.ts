export default function solution(input: string): number {
  return input.split('\n')
              .map(line => line.split(''))
              .filter(chars => chars.length > 0)
              .map(_parseNumbers)
              .map(nums => Number(nums[0].toString() + nums[nums.length - 1].toString()))
              .reduce((agg, code) => agg + code, 0);
}

const numMap = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9
}

function _parseNumbers(chars: string[]): number[] {
  const combined: string = chars.join('');
  const numArray: number[] = [];
  const numNames: string[] = Object.keys(numMap);
  let charBuilder: string = '';
  for (let i = 0; i < chars.length; i++) {
    if (!isNaN(Number(chars[i]))) {
      numArray.push(Number(chars[i]));
      charBuilder = '';
      continue;
    }
    
    for (let ki = 0; ki < numNames.length; ki++) {
      const key = numNames[ki];
      if (combined.indexOf(key, i) === i) {
        numArray.push(numMap[key]);
        continue;
      }
    }
  }
  return numArray;
}