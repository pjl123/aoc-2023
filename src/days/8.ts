export default function solution(input: string): number {
  const linesSplit = input.split('\n\n').filter(l => l.length > 0);
  const instructions = linesSplit[0].trim();

  const nodeInputs = linesSplit[1].split('\n').filter(l => l.length > 0);
  const nodeDict = {};
  const nodes = [];
  const currNodes = [];
  const steps = [];
  for (let i = 0; i < nodeInputs.length; i++) {
    const nodeInput = nodeInputs[i];
    const node = _parseNode(nodeInput);
    nodeDict[node.label] = node;
    nodes.push(node);
    if (node.label.endsWith('A')) {
      currNodes.push(node);
      steps.push(0);
    }
  }
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const linkReg = new RegExp(/\((?<left>\w+?), (?<right>\w+?)\)/i)
    const groups = linkReg.exec(node.input).groups;
    node.left = nodeDict[groups['left']];
    node.right = nodeDict[groups['right']];
  }

  const completedSteps = new Array(steps.length).fill(-1);
  let instInd = 0;
  while (completedSteps.filter(s => s > 0).length !== currNodes.length) {
    const inst = instructions[instInd];
    for (let i = 0; i < currNodes.length; i++) {
      const node = currNodes[i];
      if (inst === 'R') {
        currNodes[i] = node.right;
      }
      else {
        currNodes[i] = node.left;
      }

      steps[i]++;
      if (completedSteps[i] === -1 && (instInd + 1) === instructions.length && currNodes[i].label.endsWith('Z')) {
        completedSteps[i] = steps[i];
      }
    }

    instInd++;
    if (instInd === instructions.length) {
      instInd = 0;
    }
  }

  console.log(completedSteps, 'https://www.calculator.net/lcm-calculator.html');

  return 0;
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