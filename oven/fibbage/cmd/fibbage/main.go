package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"reflect"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

var upgrader = websocket.Upgrader{} // use default options

// TODO: struct for answer and user mapping

type Command struct {
	Type string          `json:"type"`
	Msg  json.RawMessage `json:"msg"`
}

type Player struct {
	Name       string
	Connection *websocket.Conn
	CurAnswer  Answer
}

type Question struct {
	Description string `json:"description"`
	answers     []Answer
}

type Answer struct {
	Description string `json:"description"`
	Correct     bool
}

type AnswerPlayerMap struct {
	Answer *Answer
	Player *Player
}
type ChoosePlayerMap struct {
	Answer *Answer
	Player *Player
}

type Instance struct {
	ID           string            `json:"id"`
	Players      map[string]Player `json:"players"`
	State        string            `json:"state"`
	ScoreBoard   map[string]int    `json:"scores"`
	RoundCount   int
	lobby        *websocket.Conn
	questions    []Question
	curQuestion  int // index to questions
	playerQueue  []string
	answerMap    map[string]AnswerPlayerMap
	chooseMap    map[string]ChoosePlayerMap
	joinHandle   *sync.WaitGroup
	answerHandle *sync.WaitGroup
	chooseHandle *sync.WaitGroup
}

// Config representation
type Config struct {
	Port     int
	LogLevel string
}

type StatusMessage struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type createRequest struct {
	Players []string `json:"players"`
	Lobby   string   `json:"lobby"`
}

type createResponse struct {
	GameID string `json:"gameId"`
	Lobby  string `json:"lobby"`
}

type joinRequest struct {
	GameID     string `json:"gameId"`
	PlayerName string `json:"name"`
}

type answerRequest struct {
	GameID string `json:"gameId"`
	Answer string `json:"answer"`
}

type questionJson struct {
	Question string
	Answer   string
}

var instances = make(map[string]*Instance)
var questions []Question
var conf Config

func init() {
	log.SetFormatter(&log.TextFormatter{FullTimestamp: true})
	log.SetOutput(os.Stdout)

	viper.SetConfigName("config") // name of config file (without extension)
	viper.AddConfigPath(".")      // optionally look for config in the working directory
	err := viper.ReadInConfig()   // Find and read the config file
	if err != nil {               // Handle errors reading the config file
		log.Fatal(fmt.Errorf("Fatal error config file: %s \n", err))
		os.Exit(1)
	}

	err = viper.Unmarshal(&conf)
	if err != nil {
		log.Fatalf("unable to decode into struct, %v", err)
	}

	lvl, err := log.ParseLevel(conf.LogLevel)
	if err != nil {
		log.Error("Invalid log level: %s", conf.LogLevel)
		os.Exit(1)
	}
	if lvl == log.DebugLevel {
		log.SetReportCaller(true)
	}
	log.SetLevel(lvl)
}

func main() {

	readQuestions()

	http.HandleFunc("/", router)

	log.Info("listen on port: " + strconv.Itoa(conf.Port))
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(conf.Port), nil))
}

func readQuestions() {
	// Open our jsonFile
	jsonFile, err := os.Open("questions.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		log.Error(err)
	}
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var result []questionJson
	json.Unmarshal([]byte(byteValue), &result)

	for _, item := range result {
		answer := Answer{
			Description: item.Answer,
			Correct:     true,
		}
		question := Question{
			Description: item.Question,
		}
		question.answers = append(question.answers, answer)
		questions = append(questions, question)
	}
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
			//TODO error handling
		}

		switch cmd.Type {
		case "listInstances":
			payload, err = listInstances(cmd.Msg)
		case "createInstance":
			payload, err = createInstance(cmd.Msg, c)
		case "joinInstance":
			payload, err = joinInstance(cmd.Msg, c)
		case "addAnswer":
			payload, err = addAnswer(cmd.Msg, c)
		case "chooseAnswer":
			payload, err = chooseAnswer(cmd.Msg, c)
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

func listInstances(msg json.RawMessage) (json.RawMessage, error) {
	instanceSlice := make([]Instance, 0, len(instances))

	for _, value := range instances {
		instanceSlice = append(instanceSlice, *value)
	}
	response, err := json.Marshal(instanceSlice)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func createInstance(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {

	var payload createRequest
	var createResponse createResponse
	var myWaitGroup sync.WaitGroup

	err := json.Unmarshal(msg, &payload)
	if err != nil {
		return nil, err
	}

	if len(payload.Players) < 2 {
		log.Error("No players for new instance")
		return nil, errors.New("No players")
	}

	myWaitGroup.Add(len(payload.Players))

	instance := Instance{
		ID:          randomString(5),
		State:       "wait",
		questions:   questions,
		lobby:       c,
		joinHandle:  &myWaitGroup,
		playerQueue: payload.Players,
		Players:     make(map[string]Player),
		answerMap:   make(map[string]AnswerPlayerMap),
		chooseMap:   make(map[string]ChoosePlayerMap),
		ScoreBoard:  make(map[string]int),
	}

	instances[instance.ID] = &instance

	go func() {
		instance.run()
	}()

	log.Info("Created Instance with id: " + instance.ID)

	createResponse.GameID = instance.ID
	createResponse.Lobby = payload.Lobby
	response, err := json.Marshal(createResponse)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func joinInstance(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {
	var payload joinRequest

	err := json.Unmarshal(msg, &payload)
	if err != nil {
		return nil, err
	}

	var status StatusMessage

	if instance, ok := instances[payload.GameID]; !ok {
		return nil, errors.New("Game not found")
	} else {
		// check if player in waitgroup
		exists := false
		for _, playerCheck := range instance.playerQueue {
			if playerCheck == payload.PlayerName {
				exists = true
			}
		}

		if !exists {
			return nil, errors.New("You are not allowed to this game")
		} else {

			var player = Player{
				Name:       payload.PlayerName,
				Connection: c,
			}

			instance.Players[player.Name] = player
			instance.ScoreBoard[player.Name] = 0

			log.Info("Player with name " + player.Name + " joined instance with id: " + instance.ID)

			instance.joinHandle.Done()

			status = StatusMessage{
				Status:  "Success",
				Message: "Successfully joined game",
			}
		}
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func addAnswer(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {

	var payload answerRequest

	err := json.Unmarshal(msg, &payload)
	if err != nil {
		return nil, err
	}

	var status StatusMessage

	if instance, ok := instances[payload.GameID]; !ok {
		return nil, errors.New("Game not found")
	} else {
		var player *Player
		for _, item := range instance.Players {
			if item.Connection.RemoteAddr() == c.RemoteAddr() {
				player = &item
				break
			}
		}

		answer := Answer{
			Description: payload.Answer,
			Correct:     false,
		}

		instance.answerMap[player.Name] = AnswerPlayerMap{
			Answer: &answer,
			Player: player,
		}

		instance.questions[instance.curQuestion].answers = append(instance.questions[instance.curQuestion].answers, answer)

		log.Info("Player with name " + player.Name + " added answer " + answer.Description + " for instance with id: " + instance.ID)

		instance.answerHandle.Done()

		status = StatusMessage{
			Status:  "Success",
			Message: "Answer successfully added",
		}
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func chooseAnswer(msg json.RawMessage, c *websocket.Conn) (json.RawMessage, error) {

	var payload answerRequest

	err := json.Unmarshal(msg, &payload)
	if err != nil {
		return nil, err
	}

	var status StatusMessage

	if instance, ok := instances[payload.GameID]; !ok {
		return nil, errors.New("Game not found")
	} else {

		var player *Player
		for _, item := range instance.Players {
			if item.Connection.RemoteAddr() == c.RemoteAddr() {
				log.Info(c.RemoteAddr(), c.LocalAddr())
				player = &item
				break
			}
		}

		for _, answer := range instance.questions[instance.curQuestion].answers {
			if answer.Description == payload.Answer {
				instance.chooseMap[player.Name] = ChoosePlayerMap{
					Answer: &answer,
					Player: player,
				}
				log.Info("Player with name " + player.Name + " choosed answer " + answer.Description + " on instance with id: " + instance.ID)
				break
			}
		}
		log.Info(instance.chooseMap)

		status = StatusMessage{
			Status:  "Success",
			Message: "Answer successfully added",
		}
		instance.chooseHandle.Done()
	}

	response, err := json.Marshal(status)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func randomString(len int) string {

	bytes := make([]byte, len)

	for i := 0; i < len; i++ {
		bytes[i] = byte(65 + rand.Intn(25)) //A=65 and Z = 65+25
	}
	return string(bytes)
}

func (instance *Instance) run() {

	log.Info("instance " + instance.ID + " waiting for players")
	instance.joinHandle.Wait()
	// time.Sleep(1 * time.Second)

	for {
		instance.State = "play"

		log.Info("instance " + instance.ID + " start game")
		instance.nextRound()
		instance.answerHandle.Wait()
		// time.Sleep(1 * time.Second)

		log.Info("instance " + instance.ID + " waiting for answers")
		instance.choose()
		instance.chooseHandle.Wait()
		// time.Sleep(1 * time.Second)

		log.Info("instance " + instance.ID + " calculating scores")
		instance.scores()

		log.Info("instance " + instance.ID + " scores sent - wait 20sec")

		if len(instance.questions) == 1 {
			var cmdResponse Command
			cmdResponse.Type = "finish"
			response, _ := json.Marshal(cmdResponse)
			for _, player := range instance.Players {
				player.Connection.WriteMessage(websocket.TextMessage, response)
				player.Connection.Close()
			}
			instance.lobby.Close()
			delete(instances, instance.ID)
			log.Info("instance " + instance.ID + " finished game")
		} else {
			time.Sleep(5 * time.Second)
		}
	}

}

func (instance *Instance) nextRound() {

	rand.Seed(time.Now().Unix())
	log.Info("instance " + instance.ID + " start next round")

	// Generate new question
	if len(instance.questions) > 1 {

		if instance.RoundCount != 0 {
			// remove question from questions
			log.Info("Remove question", instance.questions[instance.curQuestion])
			instance.questions = append(instance.questions[:instance.curQuestion], instance.questions[instance.curQuestion+1:]...)
		}
		instance.curQuestion = rand.Intn(len(instance.questions))
	} else {
		instance.curQuestion = 0
	}
	instance.RoundCount++

	// Add waitgroup for question
	var myWaitGroup sync.WaitGroup
	myWaitGroup.Add(len(instance.Players))
	instance.answerHandle = &myWaitGroup

	// Push question to players
	var cmdResponse Command
	cmdResponse.Type = "question"
	cmdResponse.Msg, _ = json.Marshal(instance.questions[instance.curQuestion])
	response, _ := json.Marshal(cmdResponse)
	log.Info(instance.Players)
	for _, player := range instance.Players {
		player.Connection.WriteMessage(websocket.TextMessage, response)
	}
}

func (instance *Instance) choose() {

	// send all answers to players
	var cmdResponse Command
	var answers []string

	for _, answer := range instance.questions[instance.curQuestion].answers {
		answers = append(answers, answer.Description)
	}

	cmdResponse.Type = "answers"
	cmdResponse.Msg, _ = json.Marshal(answers)
	response, _ := json.Marshal(cmdResponse)
	for _, player := range instance.Players {
		player.Connection.WriteMessage(websocket.TextMessage, response)
	}

	// wait for choose
	var myWaitGroup sync.WaitGroup
	myWaitGroup.Add(len(instance.Players))
	instance.chooseHandle = &myWaitGroup
}

func (instance *Instance) scores() {

	log.Info(instance.chooseMap)
	// write score
	for _, player := range instance.Players {

		log.Info(player)

		chooseMap, ok := instance.chooseMap[player.Name]

		log.Info(chooseMap)
		if !ok {
			log.Info("Player " + player.Name + " not found in chooseMap")
			continue
		}

		log.Info(chooseMap.Answer)
		if chooseMap.Answer.Correct {
			instance.ScoreBoard[chooseMap.Player.Name] = instance.ScoreBoard[chooseMap.Player.Name] + 20
			log.Info("Player with name " + player.Name + " choosed the correct answer " + chooseMap.Answer.Description + " on instance with id: " + instance.ID)
		} else {
			log.Info("wrong answer")
			for _, answerMap := range instance.answerMap {
				if reflect.DeepEqual(answerMap.Answer, chooseMap.Answer) {
					instance.ScoreBoard[answerMap.Player.Name] = instance.ScoreBoard[answerMap.Player.Name] + 10
					log.Info("Player with name " + player.Name + " choosed the wrong answer. " + answerMap.Player.Name + " got its points")
				}
			}
		}

	}

	// send score
	var cmdResponse Command
	cmdResponse.Type = "scores"
	cmdResponse.Msg, _ = json.Marshal(instance.ScoreBoard)
	log.Info(string(cmdResponse.Msg))
	response, _ := json.Marshal(cmdResponse)
	for _, player := range instance.Players {
		player.Connection.WriteMessage(websocket.TextMessage, response)
	}
}
