import { h, Component } from 'preact';
import linkState from 'linkstate';
import LobbyHeader from './lobby-header';
import Modal from '../modal';
import Toast from '../toast';
import style from './style';

export default class Lobby extends Component {

    state = {
        username: '',
        lobbyname: '',
        gametype: '',
        loggedIn: false,
        loginModal: false,
        gameModal: false,
        gameCreated: false,
    }


    componentDidMount() {
        const username = localStorage.getItem('username');

        if (username) {
            this.setState({username});
            this.login();
        }
    }

    showLogin = () => {
        this.setState({loginModal: true});
    }

    dismissLogin = () => {
        this.setState({loginModal: false});
    }

    showGameModal = (username, gametype) => {
        this.setState({gameModal: true,
            username: username, gametype: gametype});
    }

    dismissCreateGame = () => {
        this.setState({gameModal: false});
    }

    login = () => {
        if (this.state.username) {
            this.setState({loginModal: false, loggedIn: true});
            localStorage.setItem('username', this.state.username);
        }
    }

    logout = () => {
        this.setState({loggedIn: false, username: ''});
        localStorage.removeItem('username');
    }

    createLobby = (lobbyname, gametype, username) => {
        this.props.createLobby(lobbyname, gametype, username);
        this.setState({gameCreated: true});
    }

    startLobby = (lobbyname) => {
        this.props.startLobby(lobbyname);
        this.setState({gameCreated: false});
    }

    mapStatus = (status) => {
        switch (status) {
            case 'Waiting':
                return (
                    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
                        <g id="icon-shape">
                            <path d="M17,18 C17,15.207604 15.3649473,12.7970951 13,11.6736312 L13,8.32636884 C15.3649473,7.2029049 17,4.79239596 17,2 L19,2 L19,0 L1,0 L1,2 L3,2 C3,4.79239596 4.63505267,7.2029049 7,8.32636884 L7,11.6736312 C4.63505267,12.7970951 3,15.207604 3,18 L1,18 L1,20 L19,20 L19,18 L17,18 Z M15,2 C15,4.41895791 13.2822403,6.43671155 11,6.89998188 L11,7.96455557 L11,10 L9,10 L9,7.96455557 L9,6.89998188 C6.71775968,6.43671155 5,4.41895791 5,2 L15,2 Z" id="Combined-Shape"></path>
                        </g>
                    </g>
                    </svg>
                );
            case 'Running':
                return (
                    <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
                        <g id="icon-shape">
                            <path d="M1,5 L10,10 L1,15 L1,5 Z M10,5 L19,10 L10,15 L10,5 Z" id="Combined-Shape"></path>
                        </g>
                    </g>
                    </svg>
                );
        }
    }

    join = (lobby) => {
        this.setState({
            gametype: lobby.game.type,
        });

        this.props.join(lobby, this.state.username);
    }

    listPlayers = () => {
        const selectedLobby = this.props.lobbies.filter(lobby => {
            return lobby.name === this.state.lobbyname;
        });

        if (selectedLobby.length > 0) {
            const lobby = selectedLobby[0];

            return (
                <div class={style.lobby__players}>
                    <b>Players joined this game:</b><br/>
                    {lobby.players.map(player => player.name).join(', ')}
                </div>
            );
        }
    }

    render({ games, lobbies, lobby, toast, dissmissToast, waitingModal }, { loggedIn, loginModal, username, gameModal, lobbyname, gametype }) {
        const gameCreated = lobby && lobby.createdBy.name === username;

        return (
            <div class={style.lobby}>
                <LobbyHeader loggedIn={loggedIn} username={username} triggerLoginForm={this.showLogin} logout={this.logout}/>

                <div class={style.lobby__subHeader}>
                    &raquo; Available Games
                </div>

                <ul class={style.lobby__list}>
                    {games && games.map(game => {
                        const image = `/assets/${game.type}.png`;
                        return (
                            <li class={style.lobby__listItem}>
                                <img class={style.lobby__gameIcon} src={image} alt={game.type}/>
                                <div class={style.lobby__gameMeta}>
                                    <div class={style.lobby__name}>{game.type}</div>
                                    <div class={style.lobby__info}>{game.maxPlayers} Players</div>
                                </div>
                                <div class={style.lobby__gameActions}>
                                    <button class={style.lobby__gameNew} disabled={!loggedIn || !game.enabled} onClick={() => { this.showGameModal(username, game.type)}}>New Game</button>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div class={style.lobby__subHeader}>
                    &raquo; Active Games
                </div>

                <ul class={style.lobby__list}>
                    {lobbies && lobbies.map(lobby => {
                        const image = `/assets/${lobby.game.type}.png`;
                        const players = Object.values(lobby.players);
                        const playerCount = players.length;
                        const isJoinable = lobby.status === 'Waiting';
                        return (
                            <li class={style.lobby__listItem}>
                                <img class={style.lobby__gameIcon} src={image} alt={lobby.game.type}/>
                                <div class={style.lobby__gameMeta}>
                                    <div class={style.lobby__name}>
                                        {lobby.name}
                                    </div>
                                    <div class={style.lobby__info}>{playerCount} / {lobby.game.maxPlayers} Players</div>
                                </div>
                                <div class={style.lobby__gameActions}>
                                    <span class={style.lobby__gameStatus}>{this.mapStatus(lobby.status)}</span>
                                    <button class={style.lobby__gameJoin} disabled={!loggedIn || !isJoinable} onClick={() => {this.join(lobby)}}>Join</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <Toast toast={toast} dismiss={dissmissToast}/>

                <Modal open={loginModal} onDismiss={this.dismissLogin}>
                    Username:<br/>
                    <input type="text" class={style.lobby__loginInput} value={username} onInput={linkState(this, 'username')}/>
                    <br/><br/>
                    <button class={style.lobby__login} onClick={this.login}>Login</button>
                </Modal>

                <Modal open={gameModal} onDismiss={this.dismissCreateGame}>
                    Lobbyname:<br/>
                    <input type="text" class={style.lobby__lobbyNameInput} value={lobbyname} onInput={linkState(this, 'lobbyname')}/>
                    <br/><br/>
                    <button class={style.lobby__createGame} onClick={() => this.createLobby(lobbyname, gametype, username)}>Play</button>
                </Modal>

                <Modal open={waitingModal} onDismiss={() => {}}>
                    {gameCreated && (<span>waiting for you to start the game...</span>)}
                    {!gameCreated && (<span>waiting for game to start...</span>)}

                    {this.listPlayers(lobbyname)}

                    <button class={style.lobby__createGame} hidden={!gameCreated} onClick={() => this.startLobby(lobbyname)}>Start game</button>
                </Modal>
            </div>
        );
    }
}
