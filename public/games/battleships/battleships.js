/// <reference path="../../../p5.global-mode.d.ts"/>


let socket;
let GamesList;

function setup(){
    noCanvas();
    socket = io.connect("http://localhost:8080");

    let newGame = createButton("New Game");
    newGame.mouseClicked(createGame);
    let refresh = createButton("Refresh");
    refresh.mouseClicked(refreshList);



    GamesList = createDiv();
    createP("Current running games: ").parent(GamesList);
    GamesList = createElement("ul").parent(GamesList);

    refreshList();

}

function refreshList(){

    let children = GamesList.child();
    while(children.length > 0){
        children[0].remove();
    }

    fetch("/games/api/list/battleships")
    .then(response => {
        console.log(response);
        return response.json();
    })
    .then(json => {
        console.log(json);


        for(let game of json){
            createElement("li", `${JSON.stringify(game)}`).parent(GamesList);
        }
    })
    .catch(err =>{
        console.log(err);
    });
}

function createGame(){

    let name = prompt("Please enter game name", "name");
    let password = prompt("Enter password, \nor leave blank for open game.");
    let data = {
        name : name,
        password : password,
    };

    fetch("/games/api/create/battleships", {
        method : "POST",
        body : JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json'
        }
    }).then(() => {
        refreshList();
    })
}

function draw(){

}