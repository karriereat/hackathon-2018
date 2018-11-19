import { Component } from 'preact';
import Modal from '../../modal';
import style from './style';

export default class TicTacToe extends Component {

    clickElement = (x, y) => {
        const msg = {
            x: x,
            y: y
        }
        this.props.sendCommand('move', msg);
    }

    renderBoard = (board, yourTurn) => {

        return board.map((row, y) => (
            <tr>
                {row.map((element, x) => {
                    if (yourTurn) {
                        if (!element) {
                            return (
                                <td>
                                    <button class={style.tictactoe__boardElement} disabled={element !== "" || !yourTurn} onClick={() => this.clickElement(x, y)} >S</button>
                                </td>
                            );
                        } else {
                            return (
                                <td>{element}</td>
                            )
                        }
                    } else {
                        if (element) {
                            return (
                                <td>{element}</td>
                            )
                        } else {
                            return (
                                <td>-</td>
                            )
                        }
                    }
                })}
            </tr>
        ))
    }


    render({gameState}) {
        if (!gameState) {
            return;
        }

        switch (gameState.type) {
            case 'board':
                if (!gameState.msg.board) {
                    return;
                }

                console.log(gameState);

                return (
                    <div>
                        {this.renderBoard(gameState.msg.board, gameState.msg.yourTurn)}
                    </div>
                );
            case 'finish':
                return (
                    <div>
                        {gameState.msg.won && (<h2>You have won</h2>)}
                        {!gameState.msg.won && (<h2>You have lost</h2>)}
                    </div>
                );
        }
    }
}
