export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  const grid = lines.map(_parseNodes);

  const gears: {[id: string] : Gear} = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const node = grid[i][j];
      if (node.nodeType !== NodeType.number) {
        continue;
      }

      for (let span = 0; span < node.rowSpan; span++) {
        if (i > 0) {
          if (j + span > 0 && grid[i - 1][j + span - 1].nodeType === NodeType.gear) {
            const key = (i - 1).toString() + '/' + (j + span - 1).toString();
            if (!(key in gears)) {
              gears[key] = new Gear();
            }
            gears[key].numbers.push(node);
            break;
          }

          if (grid[i - 1][j + span].nodeType === NodeType.gear) {
            const key = (i - 1).toString() + '/' + (j + span).toString();
            if (!(key in gears)) {
              gears[key] = new Gear();
            }
            gears[key].numbers.push(node);
            break;
          }

          if (j + span < grid[i].length - 1 && grid[i - 1][j + span + 1].nodeType === NodeType.gear) {
            const key = (i - 1).toString() + '/' + (j + span + 1).toString();
            if (!(key in gears)) {
              gears[key] = new Gear();
            }
            gears[key].numbers.push(node);
            break;
          }
        }

        if (j + span > 0 && grid[i][j + span - 1].nodeType === NodeType.gear) {
          const key = i.toString() + '/' + (j + span - 1).toString();
          if (!(key in gears)) {
            gears[key] = new Gear();
          }
          gears[key].numbers.push(node);
          break;
        }

        if (j + span < grid[i].length - 1 && grid[i][j + span + 1].nodeType === NodeType.gear) {
          const key = i.toString() + '/' + (j + span + 1).toString();
          if (!(key in gears)) {
            gears[key] = new Gear();
          }
          gears[key].numbers.push(node);
          break;
        }

        if (i < grid.length - 1) {
          if (j + span > 0 && grid[i + 1][j + span - 1].nodeType === NodeType.gear) {
            const key = (i + 1).toString() + '/' + (j + span - 1).toString();
            if (!(key in gears)) {
              gears[key] = new Gear();
            }
            gears[key].numbers.push(node);
            break;
          }

          if (grid[i + 1][j + span].nodeType === NodeType.gear) {
            const key = (i + 1).toString() + '/' + (j + span).toString();
            if (!(key in gears)) {
              gears[key] = new Gear();
            }
            gears[key].numbers.push(node);
            break;
          }

          if (j + span < grid[i].length - 1 && grid[i + 1][j + span + 1].nodeType === NodeType.gear) {
            const key = (i + 1).toString() + '/' + (j + span + 1).toString();
            if (!(key in gears)) {
              gears[key] = new Gear();
            }
            gears[key].numbers.push(node);
            break;
          }
        }
      }
      j += node.rowSpan;
    }
  }

  return Object.values(gears)
               .filter(g => g.numbers.length === 2)
               .map(g => Number(g.numbers[0].character) * Number(g.numbers[1].character))
               .reduce((agg, curr) => agg + curr);
}

function _parseNodes(line: string): Node[] {
  const nodes: Node[] = [];
  let prevNode = null;
  for (let i = 0; i < line.length; i++) {
    const character = line[i];
    const isNumeric = !isNaN(Number(line[i]));
    if (isNumeric) {
      if (prevNode !== null) {
        prevNode.character += character;
        prevNode.rowSpan += 1;
        nodes.push(prevNode);
      }
      else {
        prevNode = new Node(character);
        nodes.push(prevNode);
      }
    }
    else {
      prevNode = null;
      nodes.push(new Node(character));
    }
    
  }
  return nodes;
}

enum NodeType {
  number,
  symbol,
  gear,
  space
}

class Node {
  character: string;
  nodeType: NodeType;
  rowSpan: number;
  constructor(character: string) {
    this.character = character;
    this.rowSpan = 1;
    this.nodeType = this._nodeType(character);
  }

  _nodeType(character: string) {
    switch (character) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        return NodeType.number
      
      case '#':
      case '+':
      case '$':
      case '%':
      case '@':
      case '-':
      case '=':
      case '&':
      case '/':
        return NodeType.symbol;

      case '.':
        return NodeType.space;

      case '*':
        return NodeType.gear;
    
      default:
        throw new Error('unknown character type' + character);
    }
  }
}

class Gear {
  numbers: Node[] = [];
}