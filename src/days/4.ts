export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  
  return lines.map(l => l.split(': ')[1])
              .map(card => card.split(' | '))
              .map(cardSplit => { return {'winning': _parseCardHash(cardSplit[0]), 'cardNums': _parseCardHash(cardSplit[1]) } })
              .map(_findMatchingNums)
              .reduce((agg, matches) => matches === 0 ? agg : agg + Math.pow(2, matches - 1), 0);
}

function _parseCardHash(input: string): Set<string> {
  return input.split(' ')
              .filter(n => n.length > 0)
              .reduce((set, num) => set.add(num), new Set<string>());
}

function _findMatchingNums(cardInfo: {[id: string] : Set<string>}): number {
  const intersection = new Set<string>(); 
  for (let i of cardInfo.winning) {
    if (cardInfo.cardNums.has(i)) { 
      intersection.add(i); 
    } 
  }
  return intersection.size;
}