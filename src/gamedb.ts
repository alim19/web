import * as mysql from "mysql";

interface DB {

};

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

    query(sql : string, values? : any) : Promise<QueryResults>{

        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (err : mysql.MysqlError, results : any[], fields : mysql.FieldInfo[]) => {
                resolve({err, results, fields} as QueryResults);
            })
        })
    }
}