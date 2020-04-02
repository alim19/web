import * as mysql from "mysql"
import { GameDB } from "../gamedb";


export type GameInitFunction = (db_server : GameDB) => void;
export type GameCreateFunction = (creator : string, password? : string) => Promise<number>;
export type GameDestroyFunction = (game_id : number) => void;
export interface GameConstructor {
    new (db_server : GameDB) : Game;
}

export interface Game{
    create : GameCreateFunction;
    destroy : GameDestroyFunction;
    name : string;
    id : number;
    [key : string] : any;
}