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
let joindata = {
    gameId: parseInt(params.get("id")),
    userName: cookies["username"],
    gamePassword: cookies["game_password"],
};
//@ts-ignore
let _socket = io();
_socket.on("connect", () => {
    _socket.emit("join", joindata);
    // _socket.removeAllListeners();
    _socket.on("welcome", (d) => {
        console.log(d);
    });
    // _socket.on("reconnect", reconnectData);
    _socket.on("kick", (reason) => {
        console.log("kick");
        console.log(reason);
        setTimeout(() => {
            window.location.href = "../";
        }, 1000);
    });
});
//# sourceMappingURL=game.js.map