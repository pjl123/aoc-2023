export default function solution(input: string): number {
  const lines = input.split('\n').filter(l => l.length > 0);
  const grid = lines.map(r => r.split(''));

  const rotatedGrid = new Array(lines[0].length);
  for (let x = 0; x < lines[0].length; x++) {
    rotatedGrid[x] = [];
    for (let y = 0; y < lines.length; y++) {
      rotatedGrid[x].push(lines[y][x]);
    }
  }
  
  const yAdds = grid.map(row => row.filter(c => c === '.').length == row.length)
                    .reduce((agg, allSpace, ind) => {
                      if (allSpace) {
                        agg.push(ind)
                      }
                      return agg;
                    }, []);

  const xAdds = rotatedGrid.map(col => col.filter(c => c === '.').length == col.length)
                           .reduce((agg, allSpace, ind) => {
                             if (allSpace) {
                               agg.push(ind)
                             }
                             return agg;
                           }, []);

  const DISTANCE_MULTIPLIER = 1000000;
  let yAdd = 0;
  const galaxies: Galaxy[] = [];
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let i = yAdd; i < yAdds.length; i++) {
      if (y >= yAdds[i]) {
        yAdd = i + 1;
      }
    }

    let xAdd = 0;
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];

      for (let i = xAdd; i < xAdds.length; i++) {
        if (x >= xAdds[i]) {
          xAdd = i + 1;
        }
      }

      if (cell === '#') {
        galaxies.push(new Galaxy(y + (yAdd * (DISTANCE_MULTIPLIER - 1)), x + (xAdd * (DISTANCE_MULTIPLIER - 1))));
      }
    }
  }

  const distances = {};
  for (let i = 0; i < galaxies.length; i++) {
    const g1 = galaxies[i];
    for (let j = 0; j < galaxies.length; j++) {
      const key = _getKey(i, j);
      if (i === j || key in distances) {
        continue;
      }
      const g2 = galaxies[j];
      distances[key] = Math.abs(g2.x - g1.x) + Math.abs(g2.y - g1.y);
    }    
  }
  
  let total = 0;
  const keys = Object.keys(distances);
  for (let i = 0; i < keys.length; i++) {
    total += distances[keys[i]];
  }
  return total;
}

function _getKey(p1, p2): string {
  const vals = [p1, p2];
  vals.sort();
  return vals[0].toString() + '_' + vals[1].toString();
}

class Galaxy {
  y: number;
  x: number;
  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }
}