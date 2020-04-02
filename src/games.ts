import * as express from "express";
import * as mysql from "mysql";
import * as io from "socket.io";
import { Server } from "http";
import { debug } from "./debug";
import { Game, GameConstructor } from "./games/game";
import { resolve } from "dns";
import { GameDB } from "./gamedb";
import { readFileSync } from "fs";

const DB = {
    active_games : {
        table : "active_games",
        active_game_id : {
            column : "active_games.active_game_id",
        },
        active_game_type_id : {
            column : "active_games.active_game_type_id",
        },
        active_game_idle : {
            column : "active_games.active_game_idle",
        }   
    },
    game_data : {
        table : "game_data",
        game_id : {
            column : "game_data.game_id",
        },
        data_key : {
            column : "game_data.data_key",
        },
        data_value : {
            column : "game_data.data_value",
        }
    },
    games : {
        table : "games",
        game_id : {
            column : "games.game_id",
        },
        game_name : {
            column : "games.game_name",
        }

    }
}
const MYSQL_CONFIG : mysql.ConnectionConfig = JSON.parse(readFileSync("./dbconf.json").toString());
const Games : GameDB = new GameDB(MYSQL_CONFIG);

// POOL.getConnection((err) => {
//     if(err){
//         console.log("NOT connected to sql server");
//     }else{
//         console.log("Connected to sql server");
//     }
// });


let socket;


function joinGame(socket : io.Socket, args : any){
    console.log(`Join game request : ${args}`);

    //check game id exists

    Games.query(`SELECT active_games.active_game_id, active_games.active_game_type_id, active_games.active_game_idle, game_data.data_value FROM active_games, game_data WHERE active_game_id = ? AND game_data.data_key = 0;`, [args.id])
    .then(res => {
        if(res.err){
            console.log(res.err);
            return;
        }
        console.log(res.results);
        if(res.results.length == 0){
            socket.disconnect(true);
        }
    });
}

function API(req : express.Request, res : express.Response, next : express.NextFunction){
    if(!/^\/games\/api\/.+/.test(req.path)) {
        next();
        return;
    }
    console.log(req.path);
    let paths : string[] = req.path.split('/');
    paths = paths.slice(paths.lastIndexOf("api")+1);
    console.log(paths);

    switch(paths[0]){
        case "list": 
            listGames(paths[1], res, next);
            return;
            break;
        case "create":
            createGame(paths[1], req, res, next);
            return;
            break;
        default:
            break;
    }

    next();
}

function game_api(app : Server){



    socket = io(app);
    socket.sockets.on("connection", (socket : io.Socket) => {
        console.log(`New connection : ${socket.id}`);
        socket.on("join", (data : any) => joinGame(socket, data));
    
        socket.on("disconnect", (args) => {
            console.log(`Socket disconnected : ${socket.id}`);
        });
    
    });

    return {API};
}



function listGames(game : string, response : express.Response, next : express.NextFunction){

    //get all active games by game name/id

    
    console.log(`Listing games for : ${game}`);
    let query : string
    if(/^[0-9]+$/.test(game)){
        query = `SELECT ${DB.active_games.active_game_id.column},${DB.game_data.data_value.column} FROM ${DB.active_games.table}, ${DB.game_data.table}, ${DB.games.table} WHERE ${DB.games.game_id.column} = ${game} AND ${DB.active_games.active_game_id.column} = ${DB.game_data.game_id.column};`
    }else{
        query = `SELECT ${DB.active_games.active_game_id.column},${DB.game_data.data_value.column} FROM ${DB.active_games.table}, ${DB.game_data.table}, ${DB.games.table} WHERE ${DB.games.game_name.column} = ${mysql.escape(game)} AND ${DB.active_games.active_game_id.column} = ${DB.game_data.game_id.column};`
    }

    Games.query(query)
    .then(results => {
        if(results.err){
            console.log(results.err);
            next();
            return;
        }
        // console.log(res);
        // console.log(fields);

        let data = [];

        for(let key in results.results){
            let row = results.results[key];
            let data_value = JSON.parse(row.data_value);
            data_value.id = row.active_game_id;
            debug(data_value);
            data.push(data_value);
            // data[row.active_game_id] = data_value;
        }
        // console.log(JSON.parse(res));

        response.type('application/json');
        response.send(data);
        response.end();
        
    }).catch(next)
    
    // next();

}

let loadedGames : Game[] = [];

function createGame(game : string ,req : express.Request, res : express.Response, next : express.NextFunction){
    if(req.method != "POST") {
        next();
        return;
    }
    let query : string
    if(/^[0-9]+$/.test(game)){
        query = `SELECT ${DB.games.game_id.column}, ${DB.games.game_name.column} FROM ${DB.games.table} WHERE ${DB.games.game_id.column} = ${game};`;
    }else{
        query = `SELECT ${DB.games.game_id.column}, ${DB.games.game_name.column} FROM ${DB.games.table} WHERE ${DB.games.game_name.column} = ${mysql.escape(game)};`;
    }

    // let query_cb : mysql.queryCallback = (err : mysql.MysqlError, results : any, fields : mysql.FieldInfo[]) => {
    //     //got game name and ID, now create new game from that info
    //     let game_id : number = results[0].game_id;
    //     let game_name : string = results[0].game_name;
    //     let game_prom : Promise<Game>;
    //     if(!loadedGames[game_id]){
    //         game_prom = new Promise((resolve, reject) => {
    //             let import_prom : Promise<any>;
    //             import_prom = import(`./games/${game_name}`)
    //             .then((_game : any) => {
    //                 let game : Game = _game.game;
    //                 loadedGames[game_id] = game;
    //                 console.log(game);
    //                 game.init(Games);
    //                 resolve(loadedGames[game_id]);
    //             }).catch(reject);
    //         })
    //     }else{
    //         game_prom = new Promise((resolve, reject) => {
    //             resolve(loadedGames[game_id]);
    //         })
    //     }
    //     game_prom.then((game : Game) => {
    //         debug(`Creating game by Alex. CHANGE`);
    //         game.create("Alex").then(active_game_id => {
    //             res.send(`Created new ${game_name} game by ${"Alex"} with id ${active_game_id}`);
    //             res.end();
    //         });
    //     }).catch(err => {
    //         //game does not exist
    //         console.log(`Game ${game_name}:${game_id} does not exist!`);
    //         next(500);

    //     });
    // };

    Games.query(query)
    .then(results => {
        let game_id : number = results.results[0].game_id;
        let game_name : string = results.results[0].game_name;
        let game_prom : Promise<Game>;
        if(!loadedGames[game_id]){
            game_prom = new Promise((resolve, reject) => {
                let import_prom : Promise<any>;
                import_prom = import(`./games/${game_name}`)
                .then((_game : any) => {
                    let game : GameConstructor = _game.game;
                    loadedGames[game_id] = new game(Games);
                    console.log(loadedGames[game_id]);
                    // game.init(Games);
                    resolve(loadedGames[game_id]);
                }).catch(reject);
            })
        }else{
            game_prom = new Promise(resolve => {
                resolve(loadedGames[game_id]);
            })
        }
        game_prom.then((game : Game) => {
            debug(`Creating game by Alex. CHANGE`);
            game.create("Alex").then(active_game_id => {
                res.send(`Created new ${game_name} game by ${"Alex"} with id ${active_game_id}`);
                res.end();
            });
        }).catch(err => {
            //game does not exist
            console.log(`Game ${game_name}:${game_id} does not exist!`);
            next(500);

        });
    }).catch(next)
}

export {game_api};