import * as express from "express";
import { sendFile } from "./sendFile";
// import * as fs from "fs";



function _404(req : express.Request, res : express.Response, next : express.NextFunction){

    res.status(404);
    if(req.path.substr(req.path.lastIndexOf('.')) != ".html"){
        res.end();

    }else{
        sendFile("public/errors/404.html", req, res, next);
        // next();
    }
}

function error(err : any, req : express.Request, res : express.Response, next : express.NextFunction){

    if(typeof(err) == 'string'){
        res.status(parseInt(err));
    }else if(typeof(err) == 'number'){
        res.status(err);
    }

    sendFile(`public/errors/${err}.html`, req, res, next);



    // next();

}

function handled_error(err : express.Errback, req : express.Request, res : express.Response, next : express.NextFunction){
    
    res.status(500);
    sendFile(`public/errors/500.html`, req, res, next);
    
    // next();
}

function unhandled_error(err : express.Errback, req : express.Request, res : express.Response, next : express.NextFunction){
    
    res.status(500);
    res.send("Serious unexpected server issue. This will be resolved as soon as possible. please bear with.");
    res.end();

}



export {_404, error, handled_error, unhandled_error};