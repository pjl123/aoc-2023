import cliProgress from 'cli-progress';

export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  const seeds = _parseSeeds(lines[0].split(': ')[1]);
  const mapInputs = input.split('\n\n').slice(1);
  
  const maps = mapInputs.map(_parseMap);

  const locProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  locProgress.start(Number.MAX_VALUE, 0);
  for (let loc = 0; loc < Number.MAX_VALUE; loc++) {
    if (_findMatchingSeed(loc, seeds, maps)) {
      locProgress.stop();
      return loc;
    }
    locProgress.update(loc);
  }
  locProgress.stop();
  return -1;
}

function _parseSeeds(seedInput: string): SeedRange[] {
  const seedInputSplit = seedInput.split(' ').filter(s => s.length > 0);
  const seedRanges: SeedRange[] = [];
  for (let i = 0; i < seedInputSplit.length; i+=2) {
    const start = Number(seedInputSplit[i]);
    const length = Number(seedInputSplit[i + 1]);
    seedRanges.push(new SeedRange(start, length));
  }
  return seedRanges;
}

function _findMatchingSeed(loc: number, seeds: SeedRange[], maps: Map[]): boolean {
  let num = loc;
  let destType = 'location';
  let map = _getMapRev(destType, maps);

  while (map) {
    for (let i = 0; i < map.mappings.length; i++) {
      const mapping = map.mappings[i];
      if (num >= mapping.destStart && num < mapping.destStart + mapping.length) {
        const diff = mapping.sourceStart - mapping.destStart;
        num = num + diff;
        break;
      }
    }
    destType = map.mapSource;
    map = _getMapRev(destType, maps);
  }

  for (let i = 0; i < seeds.length; i++) {
    const seedRange = seeds[i];
    if (num >= seedRange.seedStart && num < seedRange.seedStart + seedRange.length) {
      return true;
    }
  }
  return false;
}

function _getMapRev(destType: string, maps: Map[]): Map {
  return maps.find(m => m.mapDest === destType);
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

class SeedRange {
  seedStart: number;
  length: number;
  constructor(seedStart: number, length: number) {
    this.seedStart = seedStart;
    this.length = length;
  }
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