const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 1234});

let players = {};
let instances = {};

createPlayer = (name) => {
    const player = {
        name,
        ws: null,
        score: 0,
        char: 'o',
        yourTurn: false,
        won: false
    };

    players[name] = player;

    return player;
}

createInstance = (name, players, ws) => {
    const id =  Math.random().toString(36).substring(2, 15);

    instances[id] = {
        id,
        ws,
        lobby: name,
        players: players.map(player => {
            return createPlayer(player);
        }),
        playersToAct: players.length,
        ready: false,
        board: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
    }

    return id;
}

sendBoard = (instance) => {
    console.log(players);
    Object.keys(players).forEach((playerName, i) => {
        let player = players[playerName];

        if (i === 0) {
            player.char = 'x';
        }

        send(player.ws, 'board', {
            board: instance.board,
            yourTurn: player.yourTurn,
        });
    });
}

send = (ws, type, params) => {
    ws.send(JSON.stringify({
        type,
        msg: params,
    }));
}

check = (instance, player) => {
    instance.board.forEach(row => {
        if (row[0] && row[0] === row[1] === row[2]) {
            player.won = true;
        }
    });
}

wss.on('connection', (ws) => {
    let player = null;
    let instance = null;

    ws.on('message', (data) => {
        const json = JSON.parse(data);

        switch (json.type) {
            case 'createInstance':
                const gameId = createInstance(json.msg.lobby, json.msg.players, ws);

                ws.send(JSON.stringify({
                    type: 'createInstance',
                    msg: {
                        gameId,
                        lobby: json.msg.lobby,
                    }
                }))
                break;
            case 'joinInstance':
                const id = json.msg.gameId;
                player = players[json.msg.name];
                instance = instances[id];

                instance.playersToAct -= 1;
                player.ws = ws;

                send(ws, 'joinInstance', {
                    status: 'Success',
                });

                if (instance.playersToAct === 0) {
                    instance.ready = true;

                    Object.keys(players).forEach((playerName, i) => {
                        if (i === 0) {
                            players[playerName].yourTurn = true;
                        }
                    })

                    sendBoard(instance);
                }
                break;
            case 'move':
                const x = json.msg.x;
                const y = json.msg.y;

                instance.board[y][x] = player.char;

                // flip turn
                Object.keys(players).forEach(playerName => {
                    let player = players[playerName];
                    player.yourTurn = !player.yourTurn;
                });

                const done = check(instance, player);

                if (done) {
                    Object.keys(players).forEach((playerName, i) => {
                        let player = players[playerName];

                        send(
                            player.ws,
                            'finish',
                            {
                                won: player.won,
                            }
                        );

                        player.ws.close();
                    });
                } else {
                    sendBoard(instance);
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('close');
    });
});