import cliProgress from 'cli-progress';

export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  
  const times = lines[0].split('Time:')[1]
                        .split(' ')
                        .filter(v => v.length > 0)
                        .map(i => Number(i));

  const distances = lines[1].split('Distance:')[1]
                            .split(' ')
                            .filter(v => v.length > 0)
                            .map(i => Number(i));

  let total = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    total *= _solver(time, distance);
  }
  return total;
}

function _solver(time: number, distance: number): number {
  let numHoldTimes = 0;
  for (let i = 0; i <= time; i++) {
    if (time * i - Math.pow(i, 2) >= distance + 1) {
      numHoldTimes ++;
    }
  }
  return numHoldTimes;
}