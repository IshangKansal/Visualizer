let grid = Array.from({ length: 20 }, () => Array(20).fill(0));


let CanPlace = true;

let algorithm = "BFS";


document.getElementById("menu").addEventListener("change", function() {
    algorithm = this.value;
    console.log("myVar changed to:", algorithm);
});

const box = document.querySelector("#container");

const marker = (i, j) => {
    let curr = document.querySelector(`button[data-id = "${i}"][data-status = "${j}"]`);
    if(grid[i][j] == 0){
        grid[i][j] = 1;
        curr.style.backgroundColor = "red";
    }else{
        grid[i][j] = 0;
        curr.style.backgroundColor = "blue";
    }
};

const MakeGrid = () => {
    let row = 0;
    let curr;
    for(let i of grid){
        box.innerHTML += `<div id = "row${row}" style = "display: grid;"> </div>`;
        curr = document.querySelector(`#row${row}`);
        for(let j in i){
            curr.style.gridTemplateColumns += " 40px";
            if(i[j] == 0){
                curr.innerHTML += `<button data-id = "${row}" data-status = "${j}" onclick="marker(${row}, ${j})" style = "background-color: blue;"></button>`;
            }else{
                curr.innerHTML += `<button data-id = "${row}" data-status = "${j}" onclick="marker(${row}, ${j})" style = "background-color: red;"></button>`;
            }
        }
        row++;
    }
};

(MakeGrid())();

