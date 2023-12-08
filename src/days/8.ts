export default function solution(input: string): number {
  const linesSplit = input.split('\n\n').filter(l => l.length > 0);
  const instructions = linesSplit[0].trim();

  const nodeInputs = linesSplit[1].split('\n').filter(l => l.length > 0);
  const nodeDict = {};
  const nodes = [];
  let currNode = nodes[0];
  for (let i = 0; i < nodeInputs.length; i++) {
    const nodeInput = nodeInputs[i];
    const node = _parseNode(nodeInput);
    nodeDict[node.label] = node;
    nodes.push(node);
    if (node.label === 'AAA') {
      currNode = node;
    }
  }
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const linkReg = new RegExp(/\((?<left>\w+?), (?<right>\w+?)\)/i)
    const groups = linkReg.exec(node.input).groups;
    node.left = nodeDict[groups['left']];
    node.right = nodeDict[groups['right']];
  }

  let loops = 0;
  let instInd = 0;
  while (currNode.label !== 'ZZZ') {
    const inst = instructions[instInd];
    if (inst === 'R') {
      currNode = currNode.right;
    }
    else {
      currNode = currNode.left;
    }
    if (currNode.label === 'ZZZ') {
      break;
    }
    instInd++;
    if (instInd === instructions.length) {
      instInd = 0;
      loops++;
    }
  }

  return (loops + 1) * instructions.length;
}

function _parseNode(line: string): Node {
  const labelReg = new RegExp(/(?<label>\w+?) =.+$/i);
  const label = labelReg.exec(line).groups['label'];
  return new Node(label, line);
}

class Node {
  label: string;
  input: string;
  left: Node;
  right: Node;
  constructor(label: string, input: string) {
    this.label = label;
    this.input = input;
  }
}