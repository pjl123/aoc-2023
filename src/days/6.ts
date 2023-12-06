import cliProgress from 'cli-progress';

export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  
  const time = Number(lines[0].split('Time:')[1].replaceAll(' ', ''));
  const distance = Number(lines[1].split('Distance:')[1].replaceAll(' ', ''));

  return _solver(time, distance);
}

function _solver(time: number, distance: number): number {
  let numHoldTimes = 0;

  const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progress.start(time, 0);
  for (let i = 0; i <= time; i++) {
    if (time * i - Math.pow(i, 2) >= distance + 1) {
      numHoldTimes ++;
    }
    progress.update(i);
  }
  progress.stop();
  return numHoldTimes;
}