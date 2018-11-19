import { h, Component } from 'preact';
import linkState from 'linkstate';
import style from './style';
import { route } from 'preact-router';

export default class Fibbage extends Component {

    state = {
        answer: '',
    }

    answerQuestion() {
        const msg = {
            gameId: this.props.gameId,
            answer: this.state.answer
        }
        this.props.sendCommand('addAnswer', msg);
    }


    chooseAnswer(answer) {
        const msg = {
            gameId: this.props.gameId,
            answer: answer
        }
        this.props.sendCommand('chooseAnswer', msg);
    }


    mapGameState = (gameState) => {
        if (!gameState) {
            return;
        }

        switch(gameState.type) {
            case 'question':
                return (
                    <div class={style.inner}>
                        <h2>Answer following question ...</h2>
                        <div class={style.fibbage__question}>{gameState.msg.description}</div>
                        <input class={style.fibbage__answerInput} onInput={linkState(this, 'answer')}></input>
                        <br/><br/>
                        <button class={style.fibbage__answer} onClick={() => this.answerQuestion()}> Answer </button>
                    </div>
                );
            case 'answers':
                return (
                    <div class={style.inner}>
                        <h2>Choose an answer ...</h2>
                        {gameState.msg && gameState.msg.map(answer => (
                            <button class={style.fibbage__answer} onClick={() => this.chooseAnswer(answer)}> {answer} </button>
                        ))}
                    </div>
                )
            case 'scores':
                const players = Object.keys(gameState.msg).map(key => {
                    return `${key}: ${gameState.msg[key]}`;
                });

                return (
                    <div class={style.inner}>
                        <h2>Scores</h2>
                        <img class={style.fibbage__winnerIcon} src={`/assets/winner.png`} alt='winner icon'/>
                        <div class={style.fibbage__scores}>
                            {players.map(item => (
                                <div>{item}</div>
                            ))}
                        </div>
                    </div>
                );
            case 'finish':
                return (
                    <div class={style.inner}>
                        <h2>Finished Game!</h2>
                        <img class={style.fibbage__winnerIcon} src={`/assets/winner.png`} alt='winner icon'/>
                        <div class={style.fibbage__scores}>
                            {gameState.msg && gameState.msg.map(scoreItem => (
                                <div>{scoreItem.playerName} : {scoreItem.score}</div>
                            ))}
                        </div>
                        <button class={style.fibbage__answer} onClick={route('/', true)}> Back to lobby</button>
                    </div>
                );
            default:
                return (
                    <div class={style.inner}>
                        <h2>Waiting for game server</h2>
                    </div>
                )
        }
    }

    render({gameState}) {
        return (
            <div class={style.fibbage}>
                {this.mapGameState(gameState)}
            </div>
        );
    }
}
