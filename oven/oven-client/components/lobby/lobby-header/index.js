import style from './style';

export default ({loggedIn, username, triggerLoginForm, logout}) => (
    <div class={style.lobbyHeader}>
        <h1>Lobby</h1>
        {!loggedIn && (
            <button class={style.lobbyHeader__login} onClick={triggerLoginForm}>Login</button>
        )}
        {loggedIn && (
            <div>
                <span>{username}</span>&nbsp;&nbsp;
                <button class={style.lobbyHeader__login} onClick={logout}>Logout</button>
            </div>
        )}
    </div>
)
