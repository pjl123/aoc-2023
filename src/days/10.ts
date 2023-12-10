export default function solution(input: string): number {
  const linesSplit = input.split('\n').filter(l => l.length > 0);

  const pipeGrid: string[][] = [];
  const stepGrid: number[][] = [];
  let currentPositions: Position[] = [];
  for (let i = 0; i < linesSplit.length; i++) {
    const line = linesSplit[i];
    pipeGrid.push(line.split(''));
    stepGrid.push(new Array(line.length).fill(-1));

    const startInd = line.indexOf('S');
    if (startInd >= 0) {
      currentPositions.push(new Position('S', startInd, i, -1, -1));
      stepGrid[i][startInd] = 0;
    }
  }

  let nextPositions: Position[] = _findConnecting(currentPositions[0], pipeGrid);
  nextPositions.forEach(p => stepGrid[p.y][p.x] = 1);
  currentPositions = nextPositions;

  while (currentPositions.length > 0) {
    nextPositions = [];
    for (let i = 0; i < currentPositions.length; i++) {
      const position = currentPositions[i];
      const next = _findConnecting(position, pipeGrid)[0];
      const prevStep = stepGrid[next.previousY][next.previousX];
      if (stepGrid[next.y][next.x] !== - 1 && stepGrid[next.y][next.x] <= prevStep + 1) {
        continue;
      }
      stepGrid[next.y][next.x] = prevStep + 1;
      nextPositions.push(next);
    }
    currentPositions = nextPositions;
  }

  return stepGrid.map(row => row.reduce((max, cell) => cell > max ? cell : max, 0))
                 .reduce((max, cell) => cell > max ? cell : max, 0);
}

function _findConnecting(pos: Position, pipeGrid: string[][]): Position[] {
  const connecting: Position[] = [];
  if (pos.x > 0 && !(pos.previousX === pos.x - 1 && pos.previousY === pos.y)) {
    const west = pipeGrid[pos.y][pos.x - 1];
    if (_canConnect(pos.pipeType, west, 'west')) {
      connecting.push(new Position(west, pos.x - 1, pos.y, pos.x, pos.y));
    }
  }
  if (pos.x < pipeGrid.length - 1 && !(pos.previousX === pos.x + 1 && pos.previousY === pos.y)) {
    const east = pipeGrid[pos.y][pos.x + 1];
    if (_canConnect(pos.pipeType, east, 'east')) {
      connecting.push(new Position(east, pos.x + 1, pos.y, pos.x, pos.y));
    }
  }
  if (pos.y > 0 && !(pos.previousX === pos.x && pos.previousY === pos.y - 1)) {
    const north = pipeGrid[pos.y - 1][pos.x];
    if (_canConnect(pos.pipeType, north, 'north')) {
      connecting.push(new Position(north, pos.x, pos.y - 1, pos.x, pos.y));
    }
  }
  if (pos.y < pipeGrid[0].length - 1 && !(pos.previousX === pos.x && pos.previousY === pos.y + 1)) {
    const south = pipeGrid[pos.y + 1][pos.x];
    if (_canConnect(pos.pipeType, south, 'south')) {
      connecting.push(new Position(south, pos.x, pos.y + 1, pos.x, pos.y));
    }
  }
  return connecting;
}

function _canConnect(pipe1Type: string, pipe2Type: string, direction: string) {
  switch (direction) {
    case 'west':
      if (['-', 'J', '7', 'S'].includes(pipe1Type) && ['-', 'F', 'L'].includes(pipe2Type)) {
        return true;
      }
      
      return false;

    case 'east':
      if (['-', 'F', 'L', 'S'].includes(pipe1Type) && ['-', 'J', '7'].includes(pipe2Type)) {
        return true;
      }
      
      return false;

    case 'north':
      if (['|', 'J', 'L', 'S'].includes(pipe1Type) && ['|', '7', 'F'].includes(pipe2Type)) {
        return true;
      }
      
      return false;

    case 'south':
      if (['|', '7', 'F', 'S'].includes(pipe1Type) && ['|', 'J', 'L'].includes(pipe2Type)) {
        return true;
      }
      
      return false;
  
    default:
      throw new Error('unknown direction: ' + direction);
  }
}

class Position {
  pipeType: string;
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  constructor(type: string, x: number, y: number, prevX: number, prevY: number) {
    this.pipeType = type;
    this.x = x;
    this.y = y;
    this.previousX = prevX;
    this.previousY = prevY;
  }
}