import * as mysql from "mysql";

interface DB {

};

interface game_data {
    name : string,
    players : string[],
    [key : string] : any,
}

interface game {
    id : number,
    type_id : number,
    data : game_data,
}

export interface QueryResults {
    err? : mysql.MysqlError;
    results? : any;
    fields? : mysql.FieldInfo[];
}

export class GameDB{
    pool : mysql.Pool;

    constructor(config : mysql.ConnectionConfig){
        this.pool = mysql.createPool(config).on("connection", (con) => {
            console.log("mysql DB connected!");
        });
    }

    async query(sql : string, values? : any) : Promise<QueryResults>{

        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (err : mysql.MysqlError, results : any[], fields : mysql.FieldInfo[]) => {
                if(err) reject(err);
                resolve({err, results, fields} as QueryResults);
            })
        })
    }

    async getActiveGames(game : string | number) : Promise<game[]>{

        let query : string
        if(typeof(game) == 'number' || /^[0-9]+$/.test(game)){
            query = `SELECT games.game_id, games.game_name FROM games WHERE games.game_id = ${game};`;
        }else{
            query = `SELECT games.game_id, games.game_name FROM games WHERE games.game_name = ${mysql.escape(game)};`;
        }
        let game_id = (await this.query(query)).results[0].game_id;
        let query_results = await this.query(`SELECT active_game_id, active_game_type_id, game_id, data_value FROM active_games, game_data WHERE game_id = active_game_id AND active_game_type_id = ${game_id} AND data_key = 0;`);
        let games : game[] = [];
        for(let row of query_results.results){
            let game : game = {
                id : row.game_id,
                type_id : row.active_game_type_id,
                data : JSON.parse(row.data_value),
            }
            games.push(game);
        }

        return games;

    }
}