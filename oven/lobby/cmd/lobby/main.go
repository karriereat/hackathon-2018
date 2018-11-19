package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// Game represents a game type
type Game struct {
	Type       string `json:"type"`
	Enabled    bool   `json:"enabled"`
	MinPlayers int    `json:"minPlayers"`
	MaxPlayers int    `json:"maxPlayers"`
	host       string
	port       int
}

// Player represents a player
type Player struct {
	Name       string `json:"name"`
	connection *websocket.Conn
}

// LobbyRequest represents a lobby create or join request.
type LobbyRequest struct {
	Lobby string `json:"lobby"`
	Game  string `json:"game"`
	Name  string `json:"name"`
}

// Lobby represents a lobby.
type Lobby struct {
	Name       string    `json:"name"`
	Game       *Game     `json:"game"`
	Status     string    `json:"status"`
	CreatedBy  *Player   `json:"createdBy"`
	Players    []*Player `json:"players"`
	connection *websocket.Conn
}

// Command represents the base for websocket messages
type Command struct {
	Type string          `json:"type"`
	Msg  json.RawMessage `json:"msg"`
}

// CreateServerRequest represents the instance creation of a game server
type CreateServerRequest struct {
	Lobby   string   `json:"lobby"`
	Players []string `json:"players"`
}

// CreateServerResponse represents the response from game servers on game creation
type CreateServerResponse struct {
	GameID string `json:"gameId"`
	Lobby  string `json:"lobby"`
}

// StartLobbyResponse represents the response after server creation to the client
type StartLobbyResponse struct {
	GameID string `json:"gameId"`
	Lobby  string `json:"lobby"`
	Host   string `json:"host"`
	Port   int    `json:"port"`
}

// StatusMessage represents the status of executed command
type StatusMessage struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// Config representation
type Config struct {
	Port     int
	LogLevel string
}

var upgrader = websocket.Upgrader{} // use default options
var players = make(map[string]*Player)
var lobbies = make(map[string]*Lobby)
var games = make(map[string]*Game)
var conf Config

func init() {
	log.SetFormatter(&log.TextFormatter{FullTimestamp: true})
	log.SetOutput(os.Stdout)

	viper.SetConfigName("config") // name of config file (without extension)
	viper.AddConfigPath(".")      // optionally look for config in the working directory
	err := viper.ReadInConfig()   // Find and read the config file
	if err != nil {               // Handle errors reading the config file
		log.Fatal(fmt.Errorf("Fatal error config file: %s", err))
		os.Exit(1)
	}

	err = viper.Unmarshal(&conf)
	if err != nil {
		log.Fatalf("unable to decode into struct, %v", err)
	}

	lvl, err := log.ParseLevel(conf.LogLevel)
	if err != nil {
		log.Error("Invalid log level: " + conf.LogLevel)
		os.Exit(1)
	}
	log.SetLevel(lvl)
	if lvl == log.DebugLevel {
		log.SetReportCaller(true)
	}
}

func main() {

	initGames()
	initLobbies()

	http.HandleFunc("/", router)

	log.Info("listen on port: " + strconv.Itoa(conf.Port))
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(conf.Port), nil))
}

func initGames() {
	games["Fibbage"] = &Game{
		Type:       "Fibbage",
		Enabled:    true,
		MinPlayers: 2,
		MaxPlayers: 5,
		host:       "localhost",
		port:       8888,
	}
	games["TicTacToe"] = &Game{
		Type:       "TicTacToe",
		Enabled:    true,
		MinPlayers: 2,
		MaxPlayers: 2,
		host:       "localhost",
		port:       1234,
	}
	games["PaperScissorRock"] = &Game{
		Type:       "PaperScissorRock",
		Enabled:    false,
		MinPlayers: 2,
		MaxPlayers: 2,
		host:       "localhost",
		port:       8888,
	}
}

func initLobbies() {

	game := games["Fibbage"]
	playersTemp := make([]*Player, 0)
	player := &Player{
		Name:       "player1",
		connection: nil,
	}
	players["player1"] = player
	playersTemp = append(playersTemp, player)
	player = &Player{
		Name:       "player2",
		connection: nil,
	}
	players["player2"] = player
	playersTemp = append(playersTemp, player)
	lobbies["test1"] = &Lobby{
		Name:      "test1",
		Game:      game,
		Status:    "Running",
		CreatedBy: player,
		Players:   playersTemp,
	}
	playersTemp = make([]*Player, 0)
	player = &Player{
		Name:       "player3",
		connection: nil,
	}
	players["player3"] = player
	playersTemp = append(playersTemp, player)
	lobbies["test2"] = &Lobby{
		Name:      "test2",
		Game:      game,
		Status:    "Waiting",
		CreatedBy: player,
		Players:   playersTemp,
	}
	playersTemp = make([]*Player, 0)
	player = &Player{
		Name:       "player4",
		connection: nil,
	}
	players["player4"] = player
	playersTemp = append(playersTemp, player)
	lobbies["test3"] = &Lobby{
		Name:      "test3",
		Game:      game,
		Status:    "Waiting",
		CreatedBy: player,
		Players:   make([]*Player, 0),
	}
}

func createOrUpdatePlayer(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {

	var playerRequest Player

	err := json.Unmarshal(msg, &playerRequest)
	if err != nil {
		return nil, err
	}

	var status StatusMessage

	_, updated, err := createOrUpdatePlayerHelper(playerRequest.Name, c)

	if updated {
		status = StatusMessage{
			Status:  "Success",
			Message: "Updated player",
		}
	} else {
		status = StatusMessage{
			Status:  "Success",
			Message: "Created player",
		}
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func createOrUpdatePlayerHelper(name string, c *websocket.Conn) (*Player, bool, error) {
	updated := false
	if player, ok := players[name]; ok {
		log.Info("Player with name " + name + "found, update player")
		player.connection = c
		updated = true
	} else {
		log.Info("Created player with name " + name)
		players[name] = &Player{
			Name:       name,
			connection: c,
		}
	}

	return players[name], updated, nil
}

func listGames(msg json.RawMessage) (json.RawMessage, error) {
	gamesSlice := make([]Game, 0, len(games))

	for _, value := range games {
		gamesSlice = append(gamesSlice, *value)
	}
	response, err := json.Marshal(gamesSlice)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func listLobbies(msg json.RawMessage) (json.RawMessage, error) {
	lobbiesSlice := make([]Lobby, 0, len(lobbies))

	for _, value := range lobbies {
		lobbiesSlice = append(lobbiesSlice, *value)
	}
	response, err := json.Marshal(lobbiesSlice)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func createLobby(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {

	var lobbyRequest LobbyRequest

	err := json.Unmarshal(msg, &lobbyRequest)
	if err != nil {
		return nil, err
	}

	var status StatusMessage
	game, ok := games[lobbyRequest.Game]
	if !ok {
		return nil, errors.New("Game not found")
	}
	lobbyName := lobbyRequest.Lobby
	if _, ok := lobbies[lobbyRequest.Lobby]; ok {
		return nil, errors.New("Lobby name already taken")
	}

	var lobby = Lobby{
		Name:    lobbyName,
		Game:    game,
		Status:  "Waiting",
		Players: make([]*Player, 0),
	}
	lobbies[lobby.Name] = &lobby

	player, _, err := createOrUpdatePlayerHelper(lobbyRequest.Name, c)
	if err != nil {
		return nil, err
	}

	lobby.CreatedBy = player
	lobby.Players = append(lobby.Players, player)

	updateLobbies()

	status = StatusMessage{
		Status:  "Success",
		Message: "Lobby successfully created",
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func joinLobby(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {

	var lobbyRequest LobbyRequest

	err := json.Unmarshal(msg, &lobbyRequest)
	if err != nil {
		return nil, err
	}

	var status StatusMessage
	lobby, ok := lobbies[lobbyRequest.Lobby]

	if !ok {
		return nil, errors.New("Lobby not found")
	}
	if lobby.Status == "Running" {
		return nil, errors.New("Cannot join lobby, game is running")
	}
	if len(lobby.Players) >= lobby.Game.MaxPlayers {
		return nil, errors.New("Cannot join lobby, lobby is full")
	}

	playerName := lobbyRequest.Name
	for _, p := range lobby.Players {
		if p.Name == playerName {
			return nil, errors.New("Player already joined the lobby")
		}
	}

	player, _, err := createOrUpdatePlayerHelper(lobbyRequest.Name, c)
	if err != nil {
		return nil, err
	}

	lobby.Players = append(lobby.Players, player)

	updateLobbies()

	status = StatusMessage{
		Status:  "Success",
		Message: "Successfully joined lobby",
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func leaveLobby(msg json.RawMessage) (json.RawMessage, error) {

	var lobbyRequest LobbyRequest

	err := json.Unmarshal(msg, &lobbyRequest)
	if err != nil {
		return nil, err
	}

	var status StatusMessage

	lobby, ok := lobbies[lobbyRequest.Lobby]
	if !ok {
		return nil, errors.New("Lobby not found")
	}
	playerName := lobbyRequest.Name
	exists := false
	for i, p := range lobby.Players {
		if p.Name == playerName {
			exists = true
			lobby.Players = append(lobby.Players[:i], lobby.Players[i+1:]...)
		}
	}

	if exists {
		return nil, errors.New("Player not found in lobby")
	}

	updateLobbies()

	status = StatusMessage{
		Status:  "Success",
		Message: "Successfully left lobby",
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func startLobby(msg json.RawMessage) (json.RawMessage, error) {
	var lobbyRequest LobbyRequest

	err := json.Unmarshal(msg, &lobbyRequest)
	if err != nil {
		return nil, err
	}

	lobby, ok := lobbies[lobbyRequest.Lobby]
	if !ok {
		return nil, errors.New("Lobby not found")
	}

	if len(lobby.Players) < lobby.Game.MinPlayers {
		return nil, errors.New("Not enough players in lobby")
	}

	u := url.URL{Scheme: "ws", Host: lobby.Game.host + ":" + strconv.Itoa(lobby.Game.port), Path: "/"}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("Cannot connect to game server dial:", err)
	}

	lobby.connection = c

	players := make([]string, 0)
	for _, p := range lobby.Players {
		players = append(players, p.Name)
	}

	createServerRequest := CreateServerRequest{
		Lobby:   lobby.Name,
		Players: players,
	}

	log.Info(createServerRequest)

	requestPayload, err := json.Marshal(createServerRequest)
	if err != nil {
		return nil, err
	}

	cmd := Command{
		Type: "createInstance",
		Msg:  requestPayload,
	}

	request, err := json.Marshal(cmd)
	if err != nil {
		return nil, err
	}

	lobby.Status = "Running"

	updateLobbies()

	err = c.WriteMessage(websocket.TextMessage, request)
	if err != nil {
		return nil, err
	}

	go func() {
		defer c.Close()
		for {
			mt, message, err := c.ReadMessage()
			if err != nil {
				log.Error(err)
				for _, l := range lobbies {
					if l.connection == nil {
						continue
					}
					if c.RemoteAddr() == l.connection.RemoteAddr() {
						log.Info("Delete lobby " + l.Name)
						delete(lobbies, l.Name)
						updateLobbies()
						break
					}
				}
				break
			}

			var cmd Command
			var cmdResponse Command
			var payload json.RawMessage
			var players []*Player

			err = json.Unmarshal(message, &cmd)
			if err != nil {
				log.Error("error:", err)
				break
			}

			switch cmd.Type {
			case "createInstance":
				players, payload, err = createServerResponse(cmd.Msg)
				log.Info(players)
				cmdResponse.Type = "startLobby"
			}

			if err != nil {
				status := StatusMessage{
					Status:  "Error",
					Message: err.Error(),
				}
				payload, err = json.Marshal(status)
				if err != nil {
					log.Error("error:", err)
					break
				}
			}

			for _, p := range players {

				cmdResponse.Msg = payload

				response, err := json.Marshal(cmdResponse)
				if err != nil {
					log.Error("error:", err)
					break
				}
				err = p.connection.WriteMessage(mt, response)
				if err != nil {
					log.Error("error:", err)
					break
				}
			}
		}
	}()

	return nil, nil
}

func createServerResponse(msg json.RawMessage) ([]*Player, json.RawMessage, error) {
	var createServerResponse CreateServerResponse
	err := json.Unmarshal(msg, &createServerResponse)
	if err != nil {
		return nil, nil, err
	}
	log.Info(createServerResponse)

	lobby, ok := lobbies[createServerResponse.Lobby]
	if !ok {
		return nil, nil, errors.New("Lobby not found")
	}

	startLobbyResponse := StartLobbyResponse{
		GameID: createServerResponse.GameID,
		Lobby:  createServerResponse.Lobby,
		Host:   lobby.Game.host,
		Port:   lobby.Game.port,
	}

	log.Info(startLobbyResponse)
	response, err := json.Marshal(startLobbyResponse)
	if err != nil {
		return nil, nil, err
	}

	return lobby.Players, response, nil
}

func updateLobbies() error {

	var cmdResponse Command
	var payload json.RawMessage

	lobbiesSlice := make([]Lobby, 0, len(lobbies))

	for _, value := range lobbies {
		lobbiesSlice = append(lobbiesSlice, *value)
	}

	log.Info("UpdateLobbies")
	log.Info(lobbiesSlice)

	payload, err := json.Marshal(lobbiesSlice)
	if err != nil {
		return err
	}

	cmdResponse.Type = "listLobbies"
	cmdResponse.Msg = payload

	response, err := json.Marshal(cmdResponse)
	if err != nil {
		log.Error("error:", err)
		return err
	}
	for _, p := range players {
		if p.connection != nil {
			err = p.connection.WriteMessage(websocket.TextMessage, response)
			if err != nil {
				log.Error("error:", err)
				continue
			}
		}
	}

	return nil
}

func router(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error(err)
		return
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Error(err)
			break
		}

		var cmd Command
		var cmdResponse Command
		var payload json.RawMessage

		err = json.Unmarshal(message, &cmd)
		if err != nil {
			log.Error("error:", err)
			break
		}

		switch cmd.Type {
		case "createOrUpdatePlayer":
			payload, err = createOrUpdatePlayer(cmd.Msg, c)
		case "listGames":
			payload, err = listGames(cmd.Msg)
		case "listLobbies":
			payload, err = listLobbies(cmd.Msg)
		case "createLobby":
			payload, err = createLobby(cmd.Msg, c)
		case "joinLobby":
			payload, err = joinLobby(cmd.Msg, c)
		case "leaveLobby":
			payload, err = leaveLobby(cmd.Msg)
		case "startLobby":
			payload, err = startLobby(cmd.Msg)
		}

		if err != nil {
			status := StatusMessage{
				Status:  "Error",
				Message: err.Error(),
			}
			payload, err = json.Marshal(status)
			if err != nil {
				log.Error("error:", err)
				break
			}

		}
		if payload == nil {
			continue
		}

		cmdResponse.Type = cmd.Type
		cmdResponse.Msg = payload

		response, err := json.Marshal(cmdResponse)
		if err != nil {
			log.Error("error:", err)
			break
		}
		err = c.WriteMessage(mt, response)
		if err != nil {
			log.Error("error:", err)
			break
		}
	}
}
