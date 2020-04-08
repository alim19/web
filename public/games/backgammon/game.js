/// <reference path="../../../p5.global-mode.d.ts" />
/// <reference path="../../../socket.io.d.ts" />
const cookies = document.cookie
    .split(';')
    .reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent);
    try {
        return Object.assign(res, {
            [key]: JSON.parse(val)
        });
    }
    catch (e) {
        return Object.assign(res, {
            [key]: val
        });
    }
}, {});
const params = new window.URLSearchParams(window.location.search);
//@ts-ignore
let _socket = io();
_socket.on("connect", () => {
    _socket.emit("join", {
        gameId: params.get("id"),
        userName: cookies["username"],
    });
    _socket.removeAllListeners();
    _socket.on("welcome", data => {
        new backgammon(_socket);
    });
});
class backgammon extends p5 {
    constructor(socket) {
        super(() => { }, document.getElementById("game"), false);
    }
}
// new backgammon(_socket);
