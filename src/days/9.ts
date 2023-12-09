export default function solution(input: string): number {
  const linesSplit = input.split('\n').filter(l => l.length > 0);
  let total = 0;
  for (let i = 0; i < linesSplit.length; i++) {
    const line = linesSplit[i];
    const rootSeq = new Sequence(line.split(' ').filter(n => n.length > 0).map(Number));
    rootSeq.child = _getChild(rootSeq);
    _extrapolate(rootSeq);
    total += rootSeq.numbers[rootSeq.numbers.length - 1];
  }
  return total;
}

function _extrapolate(sequence: Sequence) {
  if (!sequence.child) {
    sequence.numbers.push(0);
    return;
  }

  _extrapolate(sequence.child);
  const lastNum = sequence.numbers[sequence.numbers.length - 1];
  const lastChildNum = sequence.child.numbers[sequence.child.numbers.length - 1];
  sequence.numbers.push(lastNum + lastChildNum);
}

function _getChild(parent: Sequence): Sequence {
  const newNums: number[] = [];
  for (let i = 0; i < parent.numbers.length - 1; i++) {
    newNums.push(parent.numbers[i + 1] - parent.numbers[i]);
  }
  const newSequence = new Sequence(newNums);
  if (newNums.filter(n => n === 0).length !== newNums.length) {
    newSequence.child = _getChild(newSequence);
  }
  return newSequence;
}

class Sequence {
  child: Sequence;
  numbers: number[]
  constructor(numbers: number[]) {
    this.numbers = numbers;
  }
}