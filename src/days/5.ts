export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  const seeds = lines[0].split(': ')[1].split(' ').filter(s => s.length > 0);

  const mapInputs = input.split('\n\n').slice(1);
  
  const maps = mapInputs.map(_parseMap);

  return seeds.map(s => _calcLocation(s, maps))
              .reduce((min, l) => l < min ? l : min);
}

function _calcLocation(seed: string, maps: Map[]): number {
  let num = Number(seed);
  let sourceType = 'seed';
  let map = _getMap(sourceType, maps);

  while (map) {
    for (let i = 0; i < map.mappings.length; i++) {
      const mapping = map.mappings[i];
      if (num >= mapping.sourceStart && num < mapping.sourceStart + mapping.length) {
        const diff = mapping.destStart - mapping.sourceStart;
        num = num + diff;
        break;
      }
    }
    sourceType = map.mapDest;
    map = _getMap(sourceType, maps);
  }

  return num;
}

function _getMap(sourceType: string, maps: Map[]): Map {
  return maps.find(m => m.mapSource === sourceType);
}

function _parseMap(mapInput: string): Map {
  const mapSplit = mapInput.split(' map:\n');
  const mapDescription = mapSplit[0];

  const rangeReg = new RegExp(/^(?<destStart>\d+)\s+(?<sourceStart>\d+)\s+(?<length>\d+)$/i);
  const ranges = mapSplit[1].split('\n');
  const mappings: RangeMapping[] = [];
  for (let i = 0; i < ranges.length; i++) {
    const matches = rangeReg.exec(ranges[i]);
    const destStart = Number(matches.groups['destStart']);
    const sourceStart = Number(matches.groups['sourceStart']);
    const length = Number(matches.groups['length']);
    
    mappings.push(new RangeMapping(sourceStart, destStart, length));
  }
  return new Map(mapDescription, mappings);
}

class Map {
  mapSource: string;
  mapDest: string;
  mappings: RangeMapping[]
  constructor(mapDescription: string, mappings: RangeMapping[]) {
    const descriptionSplit = mapDescription.split('-to-');
    this.mapSource = descriptionSplit[0];
    this.mapDest = descriptionSplit[1];
    this.mappings = mappings;
  }
}

class RangeMapping {
  sourceStart: number;
  destStart: number;
  length: number;
  constructor(sourceStart: number, destStart: number, length: number) {
    this.sourceStart = sourceStart;
    this.destStart = destStart;
    this.length = length;
  }
}