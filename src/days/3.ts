export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  const grid = lines.map(_parseNodes);

  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const node = grid[i][j];
      if (node.nodeType !== NodeType.number) {
        continue;
      }

      for (let span = 0; span < node.rowSpan; span++) {
        if (i > 0) {
          if (j + span > 0 && grid[i - 1][j + span - 1].nodeType === NodeType.symbol) {
            sum += Number(node.character);
            break;
          }

          if (grid[i - 1][j + span].nodeType === NodeType.symbol) {
            sum += Number(node.character);
            break;
          }

          if (j + span < grid[i].length - 1 && grid[i - 1][j + span + 1].nodeType === NodeType.symbol) {
            sum += Number(node.character);
            break;
          }
        }

        if (j + span > 0 && grid[i][j + span - 1].nodeType === NodeType.symbol) {
          sum += Number(node.character);
          break;
        }

        if (j + span < grid[i].length - 1 && grid[i][j + span + 1].nodeType === NodeType.symbol) {
          sum += Number(node.character);
          break;
        }

        if (i < grid.length - 1) {
          if (j + span > 0 && grid[i + 1][j + span - 1].nodeType === NodeType.symbol) {
            sum += Number(node.character);
            break;
          }

          if (grid[i + 1][j + span].nodeType === NodeType.symbol) {
            sum += Number(node.character);
            break;
          }

          if (j + span < grid[i].length - 1 && grid[i + 1][j + span + 1].nodeType === NodeType.symbol) {
            sum += Number(node.character);
            break;
          }
        }
      }
      j += node.rowSpan;
    }
  }

  return sum;
}

function _parseNodes(line: string, yIndex: number): Node[] {
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
      case '*':
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
    
      default:
        throw new Error('unknown character type' + character);
    }
  }
}