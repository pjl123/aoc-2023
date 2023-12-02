export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);

  return lines.map(line => {
      const rounds: string[] = line.split(': ')[1].split('; ');
      return _minCubeCounts(rounds);
    })
    .map(counts => Object.keys(counts).reduce((agg, curr) => agg * counts[curr], 1))
    .reduce((agg, curr) => agg + curr, 0);
}

function _minCubeCounts(rounds: string[]): object {
  const minCounts = {};
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const marbleCounts = round.split(', ');
    for (let j = 0; j < marbleCounts.length; j++) {
      const countSplit = marbleCounts[j].split(' ');
      const count = Number(countSplit[0]);
      const color = countSplit[1];

      if (!(color in minCounts) || minCounts[color] < count) {
        minCounts[color] = count;
      }
    }
  }
  return minCounts;
}