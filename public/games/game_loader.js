/// <reference path="../../p5.global-mode.d.ts"/>

let GamesList;
let game;

function setup(){
    noCanvas();

    let newGame = createButton("New Game");
    newGame.mouseClicked(createGame);
    let refresh = createButton("Refresh");
    refresh.mouseClicked(refreshList);


    let path = getURLPath();
    game = path[path.lastIndexOf("games")+1];


    GamesList = createDiv();
    createP("Current running games: ").parent(GamesList);
    GamesList = createElement("ul").parent(GamesList);

    refreshList();

}

function refreshList(){

    let path = getURLPath();
    let game = path[path.lastIndexOf("games")+1];

    fetch(`/games/api/list/${game}`)
    .then(response => {
        // console.log(response);
        return response.json();
    })
    .then(json => {
        // console.log(json);
        let children = GamesList.child();
        while(children.length > 0) children[0].remove();

        for(let _game of json){
            let child = createElement("li");
            child.parent(GamesList);
            child.html(JSON.stringify(_game));
            let join_button = createButton("Join");
            join_button.parent(child);
            join_button.mouseClicked(joinGame.bind(_game));
            // child.html(`<a href='/games/${game}/game.html?id=${_game.id}'>Join</a>`, true);
            // createElement("li", `${JSON.stringify(game)}`).parent(GamesList);
        }
    })
    .catch(err =>{
        console.log(err);
    });
}

function joinGame(){

    if(document.cookie.indexOf("username") == -1){
        let uname = prompt("You need to choose a username first!", "username");
        document.cookie = `username=${uname}`;
        return;
    }

    let password = "";
    if(this.password_protected){
        password = prompt("Please enter the password for this game.");
    }
    document.cookie = `game_password=${password}`;
    location.assign(`/games/${game}/game.html?id=${this.id}`);

}

function createGame(){

    let name = prompt("Please enter game name", "name");
    if(name == null) return;
    let password = prompt("Enter password, \nor leave blank for open game.");
    let data = {
        name : name,
        password : password,
    };

    fetch(`/games/api/create/${game}`, {
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