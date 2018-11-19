import { h, Component } from 'preact';
import style from './style';
import Fibbage from './fibbage';
import TicTacToe from './tictactoe';

export default class Game extends Component {

    state = {}

    mapGameType = (gameState, gametype, gameId, sendCommand) => {
        switch(gametype) {
            case 'Fibbage':
                return (
                    <Fibbage gameState={gameState} gameId={gameId} sendCommand={sendCommand}/>
                );
            case 'TicTacToe':
                return (
                    <TicTacToe gameState={gameState} gameId={gameId} sendCommand={sendCommand}/>
                );
        }
    }

    render({gameState, gametype, gameId, sendCommand}) {
        return (
            <div class={style.game}>
                <div class={style.game__header}>
                    <h1>{gametype}</h1>
                </div>
                {this.mapGameType(gameState, gametype, gameId, sendCommand)}
            </div>
        );
    }
}
