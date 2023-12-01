export default function solution(input: string) : number {
  return input.split('\n')
              .map(line => line.split(''))
              .filter(chars => chars.length > 0)
              .map(chars => chars.filter(c => !isNaN(Number(c))))
              .map(nums => nums[0].toString() + nums[nums.length - 1].toString())
              .reduce((agg, code) => agg + parseInt(code), 0);
  return 0;
}