export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  
  const hands = lines.map(_parseHand);
  hands.sort(_compareHand);

  return hands.map((h, i) => h.bid * (i + 1))
              .reduce((agg, v) => agg + v, 0);
}

function _parseHand(input: string): Hand {
  return new Hand(input);
}

function _compareHand(h1: Hand, h2: Hand): number {
  if (h1.type === h2.type) {
    for (let i = 0; i < h1.cards.length; i++) {
      if (CARD_VALUES[h1.cards[i]] === CARD_VALUES[h2.cards[i]]) {
        continue;
      }
      return CARD_VALUES[h1.cards[i]] - CARD_VALUES[h2.cards[i]];
    }
  }
  return h1.type - h2.type;
}

enum HandType {
  HighCard = 1,
  OnePair = 2,
  TwoPair = 3,
  ThreeOfAKind = 4,
  FullHouse = 5,
  FourOfAKind = 6,
  FiveOfAKind = 7
}

const CARD_VALUES = {
  'J': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'Q': 12,
  'K': 13,
  'A': 14
}

class Hand {
  input: string;
  type: HandType;
  cards: string;
  bid: number;
  constructor(input: string) {
    this.input = input;
    this.cards = input.split(' ')[0];
    this.type = this._getHandType(this.cards);
    this.bid = Number(input.split(' ')[1].trim());
  }

  _getHandType(cards: string): HandType {
    const counts = cards.split('')
                        .reduce((obj, c) => {
                          if (obj[c]) {
                            obj[c]++;
                          }
                          else {
                            obj[c] = 1;
                          }
                          return obj;
                        }, {});
    
    let wilds = counts['J'] ? counts['J'] : 0;
    delete counts['J'];

    if (wilds === 5) {
      return HandType.FiveOfAKind;
    }

    const groups = Object.keys(counts);
    if (groups.length === 1) {
      return HandType.FiveOfAKind;
    }

    if (groups.length === 5) {
      return HandType.HighCard;
    }

    let countPairs = 0;
    let countThree = 0;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (counts[group] + wilds === 4) {
        return HandType.FourOfAKind;
      }

      if (counts[group] === 3) {
        countThree++;
      }

      if (counts[group] === 2) {
        countPairs++;
      }
    }

    if (countPairs === 2 && wilds === 1) {
      return HandType.FullHouse;
    }

    if (countThree === 1) {
      if (countPairs === 1) {
        return HandType.FullHouse;
      }

      return HandType.ThreeOfAKind
    }

    if (countPairs === 0 && wilds === 2) {
      return HandType.ThreeOfAKind;
    }

    if (countPairs === 1 && wilds === 1) {
      return HandType.ThreeOfAKind;
    }

    if (countPairs === 2) {
      return HandType.TwoPair;
    }

    return HandType.OnePair;
  }
}