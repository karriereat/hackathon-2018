import './style';
import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import Sockette from 'sockette';
import Lobby from './components/lobby';
import Game from './components/game';

export default class App extends Component {
    state = {
        lobbies: [],
        toast: {},
        waitingModal: false,
        gameState: null,
        canJoin: false,
        currentLobby: '',
    }

    requestLobbies = () => {
        this.sendLobbyMessage('listLobbies', {});
    }

    requestGames = () => {
        this.sendLobbyMessage('listGames', {});
    }

    requestCreateGame= () => {
        this.sendGameMessage('createGame', {});
    }

    componentDidMount() {
        if (!this.gameSocket) {
            route('/', true);
        }

        this.lobbySocket = new Sockette('ws://localhost:9090', {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: this.onLobbyOpen,
            onmessage: this.onLobbyMessage,
            onreconnect: this.onLobbyReconnect,
            onmaximum: e => console.log('Stop Attempting!', e),
            onclose: e => console.log('Closed!', e),
            onerror: e => console.log('Error:', e)
          });
    }

    onLobbyOpen = ev => {
        this.requestLobbies();
        this.requestGames();
    };

    onGameOpen = ev => {
        if (this.state.canJoin) {
            this.setState({
                canJoin: false,
            });

            this.sendGameMessage(
                'joinInstance',
                {
                    gameId: this.state.gameId,
                    name: this.state.username,
                }
            );
        }
    };

    onLobbyMessage = ev => {
        const data = JSON.parse(ev.data);

        console.log('lobby receive');
        console.log(data);

        switch (data.type) {
            case 'listLobbies':
                this.setState({
                    lobbies: data.msg
                });
                break;
            case 'listGames':
                this.setState({
                    games: data.msg
                });
                break;
            case 'createLobby':
            case 'joinLobby':
                if (data.msg.status === 'Success') {
                    this.requestLobbies();
                    this.setState({
                        waitingModal: true,
                    });
                } else {
                    this.setState({
                        toast: {
                            type: 'error',
                            message: data.msg.message,
                        }
                    });
                }
                break;
            case 'startLobby':
                if (data.msg.gameId) {
                    this.startGame(data.msg);
                    this.setState({
                        canJoin: true,
                    });
                } else {
                    this.setState({
                        toast: {
                            type: 'error',
                            message: data.msg.message,
                        }
                    });
                }
                break;
        }
    };

    onGameMessage = ev => {
        const data = JSON.parse(ev.data);

        console.log('game receive');
        console.log(data);

        switch (data.type) {
            case 'joinInstance':
                if (data.msg.status === 'Success') {
                    route('/game', true);
                }
                break;
            case 'addAnswer':
                break;
            default:
                this.setState({
                    gameState: data
                });
                break;
        }
    };

    onLobbyReconnect = ev => {
        console.log('reconnect', ev);
    };

    onGameReconnect = ev => {
        console.log('reconnect', ev);
    };

    sendLobbyMessage = (type, params) => {
        const message = {
            type,
            msg: params,
        };

        console.log('lobby send');
        console.log(message);

        this.lobbySocket.send(JSON.stringify(message));
    };

    sendGameMessage = (type, params) => {
        const message = {
            type,
            msg: params,
        };

        console.log('game send');
        console.log(message);

        this.gameSocket.send(JSON.stringify(message));
    };

    createLobby = (lobbyname, gametype, username) => {
        this.sendLobbyMessage(
            'createLobby',
            {
                lobby: lobbyname,
                game: gametype,
                name: username,
            }
        );

        this.setState({ username, gametype, currentLobby: lobbyname });
    }

    rejoin = (username) => {
        this.sendLobbyMessage(
            'createOrUpdatePlayer',
            {
                name: username,
            }
        );
    }

    join = (lobby, username) => {
        this.sendLobbyMessage(
            'joinLobby',
            {
                lobby: lobby.name,
                name: username,
            }
        );

        this.setState({ username, gametype: lobby.game.type, currentLobby: lobby.name });
    };

    startLobby = (lobbyName) => {
        this.sendLobbyMessage(
            'startLobby',
            {
                lobby: lobbyName,
            }
        );
    }

    startGame = (params) => {
        const host = `ws://${params.host}:${params.port}`;

        this.setState({
            gameId: params.gameId,
        });

        this.gameSocket = new Sockette(host, {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: this.onGameOpen,
            onmessage: this.onGameMessage,
            onreconnect: this.onGameReconnect,
            onmaximum: e => console.log('Stop Attempting!', e),
            onclose: e => console.log('Closed!', e),
            onerror: e => console.log('Error:', e)
          });
    }

    sendCommand = (type, params) => {
        this.sendGameMessage(type, params);
    }

    dissmissToast = () => {
        this.setState({ toast: {} });
    }

    render({}, { games, lobbies, currentLobby, toast, waitingModal, gametype, gameState, gameId }) {
        const filtered = lobbies.filter(lobby => {
            return lobby.name === currentLobby;
        });

        let lobby = null;



        if (filtered.length > 0) {
            lobby = filtered[0];
        }

        return (
            <div class="main">
                <Router>
                    <Lobby
                        path="/"
                        lobbies={lobbies}
                        games={games}
                        lobby={lobby}
                        join={this.join}
                        rejoin={this.rejoin}
                        createLobby={this.createLobby}
                        toast={toast}
                        dissmissToast={this.dissmissToast}
                        waitingModal={waitingModal}
                        startLobby={this.startLobby}
                    />
                    <Game
                        path="/game"
                        gameState={gameState}
                        gametype={gametype}
                        gameId={gameId}
                        sendCommand={this.sendCommand}
                    />
                </Router>
            </div>
        );
    }
}
