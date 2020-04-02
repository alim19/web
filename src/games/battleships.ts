import {Game, GameInitFunction, GameCreateFunction, GameDestroyFunction, GameConstructor} from "./game";
import { debug } from "../debug";
import { GameDB } from "../gamedb";
import { rejects } from "assert";

const battleships : GameConstructor = class battleships implements Game{
    
    public id : number = 1;
    public name : string = "battleships";

    protected db : GameDB;
    
    constructor(db_server : GameDB){
        this.db = db_server;
    }
    // init(){}
    create(creator : string, password? : string) : Promise<number>{
        debug(`Battleships creating game by ${creator}`);
        return new Promise<number>((resolve, reject) => {
            this.db.query(`INSERT INTO active_games(active_game_type_id, active_game_idle) VALUES (${this.id}, now());`) // 
            .then(results => {
                console.log(results.results);
                resolve(results.results.insertId || -1);
                let json_data : any = {name: creator, players : [], password : password};
                if(password){
                    json_data.password = password;
                }
                return this.db.query(`INSERT INTO game_data(game_id, data_key, data_value) VALUES (${results.results.insertId}, 0, ?);`, JSON.stringify(json_data));
            })
            .then(results => {
                console.log(results);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        })

    }

    destroy(){

    }
}

export {battleships as game};