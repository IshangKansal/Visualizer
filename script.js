let grid = Array.from({ length: 20 }, () => Array(20).fill(0));

let CanPlace = true;

let algorithm = "BFS";

document.getElementById("menu").addEventListener("change", function () {
    algorithm = this.value;
    console.log("myVar changed to:", algorithm);
});

const box = document.querySelector("#container");

const marker = (i, j) => {
    if (CanPlace) {
        let curr = document.querySelector(
            `button[data-id = "${i}"][data-status = "${j}"]`
        );
        if (grid[i][j] == 0) {
            grid[i][j] = 1;
            curr.style.backgroundColor = "red";
        } else {
            grid[i][j] = 0;
            curr.style.backgroundColor = "blue";
        }
    } else {
        alert("change to the placing mode");
    }
};

(() => {
    let row = 0;
    let curr;
    for (let i of grid) {
        box.innerHTML += `<div id = "row${row}" style = "display: grid;"> </div>`;
        curr = document.querySelector(`#row${row}`);
        for (let j in i) {
            curr.style.gridTemplateColumns += " 40px";
            if (i[j] == 0) {
                curr.innerHTML += `<button data-id = "${row}" data-status = "${j}" onclick="marker(${row}, ${j})" style = "background-color: blue;"></button>`;
            } else {
                curr.innerHTML += `<button data-id = "${row}" data-status = "${j}" onclick="marker(${row}, ${j})" style = "background-color: red;"></button>`;
            }
        }
        row++;
    }
})();


const mark = (x, y) => {
  return new Promise(resolve => {
    setTimeout(() => {
      document.querySelector(
        `button[data-id="${x}"][data-status="${y}"]`
      ).style.backgroundColor = "purple";
      resolve();
    }, 100); 
  });
};


async function dijkstraGrid(grid, start, end) {
    const n = grid.length;
    const m = grid[0].length;

    const dist = Array.from({ length: n }, () => Array(m).fill(Infinity));
    const pq = [];

    const directions = [
        [-1, 0], 
        [1, 0], 
        [0, -1], 
        [0, 1], 
    ];

    dist[start[0]][start[1]] = 0;
    pq.push([0, start[0], start[1]]);

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, x, y] = pq.shift();

        if (grid[x][y] === 0) {
            await mark(x,y);
        }

        if (x === end[0] && y === end[1]) {
            return d;
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < n && ny >= 0 && ny < m && grid[nx][ny] === 0) {
                if (d + 1 < dist[nx][ny]) {
                    dist[nx][ny] = d + 1;
                    pq.push([dist[nx][ny], nx, ny]);
                }
            }
        }
    }

    return -1; 
}

const heuristic = (x, y, end) => {
  return Math.abs(x - end[0]) + Math.abs(y - end[1]);
};

class MinHeap {
  constructor() {
    this.data = [];
  }
  push(item) {
    this.data.push(item);
    this.bubbleUp();
  }
  pop() {
    if (this.data.length === 0) return null;
    const top = this.data[0];
    const end = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = end;
      this.bubbleDown();
    }
    return top;
  }
  isEmpty() {
    return this.data.length === 0;
  }
  bubbleUp() {
    let idx = this.data.length - 1;
    const element = this.data[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.data[parentIdx];
      if (element[0] >= parent[0]) break;
      this.data[parentIdx] = element;
      this.data[idx] = parent;
      idx = parentIdx;
    }
  }
  bubbleDown() {
    let idx = 0;
    const length = this.data.length;
    const element = this.data[0];
    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let swap = null;
      if (leftIdx < length) {
        if (this.data[leftIdx][0] < element[0]) {
          swap = leftIdx;
        }
      }
      if (rightIdx < length) {
        if (
          (swap === null && this.data[rightIdx][0] < element[0]) ||
          (swap !== null && this.data[rightIdx][0] < this.data[leftIdx][0])
        ) {
          swap = rightIdx;
        }
      }
      if (swap === null) break;
      this.data[idx] = this.data[swap];
      this.data[swap] = element;
      idx = swap;
    }
  }
}

async function aStarGrid(grid, start, end) {
  const n = grid.length;
  const m = grid[0].length;

  const dist = Array.from({ length: n }, () => Array(m).fill(Infinity));
  const fScore = Array.from({ length: n }, () => Array(m).fill(Infinity));
  const pq = new MinHeap();

  const directions = [
    [-1, 0], [1, 0],
    [0, -1], [0, 1],
  ];

  dist[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = heuristic(start[0], start[1], end);
  pq.push([fScore[start[0]][start[1]], 0, start[0], start[1]]);

  while (!pq.isEmpty()) {
    const [f, g, x, y] = pq.pop();

    if (grid[x][y] === 0) {
      await mark(x, y);
    }

    if (x === end[0] && y === end[1]) {
      return g; 
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < n && ny >= 0 && ny < m && grid[nx][ny] === 0) {
        const newG = g + 1;
        if (newG < dist[nx][ny]) {
          dist[nx][ny] = newG;
          const newF = newG + heuristic(nx, ny, end);
          fScore[nx][ny] = newF;
          pq.push([newF, newG, nx, ny]);
        }
      }
    }
  }

  return -1; 
}


const runbtn = document.querySelector("#run");
runbtn.addEventListener("click", (e) => {
    e.preventDefault();
    const st = [
        parseInt(document.querySelector("#startx").value, 10),
        parseInt(document.querySelector("#starty").value, 10),
    ];
    const en = [
        parseInt(document.querySelector("#endx").value, 10),
        parseInt(document.querySelector("#endy").value, 10),
    ];
    if(algorithm === "BFS") {
      dijkstraGrid(grid, st, en);
    }else if(algorithm === "ASTAR"){
      aStarGrid(grid, st, en);
    }
});
