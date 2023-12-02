export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);

  return lines.map(line => {
      const id: string = line.split(':')[0].split(' ')[1];
      const rounds: string[] = line.split(': ')[1].split('; ');
      if (_gameViolatesLimits(rounds)) {
        return 0;
      }
      return Number(id);
    })
    .reduce((agg, curr) => agg + curr, 0);
}

const limits = {
  'red': 12,
  'green': 13,
  'blue': 14
}

function _gameViolatesLimits(rounds: string[]): boolean {
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const marbleCounts = round.split(', ');
    for (let j = 0; j < marbleCounts.length; j++) {
      const countSplit = marbleCounts[j].split(' ');
      const count = Number(countSplit[0]);
      const color = countSplit[1];

      if (limits[color] < count) {
        return true;
      }
    }
  }
  return false;
}