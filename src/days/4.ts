export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  
  const cards = lines.map(l => l.split(': ')[1])
                     .map(card => card.split(' | '))
                     .map(cardSplit => { return {'winning': _parseCardHash(cardSplit[0]), 'cardNums': _parseCardHash(cardSplit[1]) } })
                     .map(_findMatchingNums)
                     .map(matches => new Card(matches));

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    for (let j = 1; j <= card.matches && j + i < cards.length; j++) {
      cards[i + j].multiplier += card.multiplier;
    }    
  }

  return cards.reduce((agg, c) => agg + c.multiplier, 0);
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

class Card {
  matches: number;
  multiplier: number;
  constructor(matches: number) {
    this.matches = matches;
    this.multiplier = 1;
  }
}