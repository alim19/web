import * as express from "express";

import {AutoRedirect as autoredir} from "./autoredirect"
import {Log} from "./log"
import * as error from "./error"
import {staticServe as serve} from "./sendFile"
import {game_api} from "./games"

const app : express.Application = express();
const PORT : number = parseInt(process.env.PORT) || 8080;

let server = app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});
const GAMES = game_api(server);

app.use(Log);
app.use(GAMES.API);

app.use(autoredir);



app.get("*", serve("public/"));

app.use(error.error);
app.use(error.handled_error);
app.use(error.unhandled_error);


