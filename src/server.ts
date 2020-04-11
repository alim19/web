import * as express from "express";

import {
	AutoRedirect as autoredir
} from "./autoredirect"
import {
	Log
} from "./log"
import * as error from "./error"
import {
	staticServe as serve
} from "./sendFile"
import {
	game_api
} from "./games"
import * as bodyParser from "body-parser";
import multer = require("multer");
import {
	forceSSL
	//@ts-ignore
} from "express-force-ssl"
import {
	readFileSync
} from "fs";
import {
	createServer
} from "https";

const upload = multer();
const app: express.Application = express();
const PORT: number = parseInt(process.env.PORT) || 8080;

const SSL_OPTS = {
	key: readFileSync(".security/origin.priv"),
	cert: readFileSync(".security/origin.pem"),
}

let secServ = createServer(SSL_OPTS, app);
secServ.listen(PORT, () => {
	console.log(`listening on port:${PORT}`);
});

// let server = app.listen(PORT, () => {
// 	console.log(`Listening on port ${PORT}`)
// });
const GAMES = game_api(secServ);


app.use(bodyParser.json());
// app.post('*', upload.array())

app.use(Log);
app.use(GAMES.API);


app.use(autoredir);



app.get("*", serve("public/"));

app.use(error.error);
app.use(error.handled_error);
app.use(error.unhandled_error);