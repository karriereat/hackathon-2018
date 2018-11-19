package at.karriere.battlebat.battlebat.controller


import at.karriere.battlebat.battlebat.domain.Game
import at.karriere.battlebat.battlebat.domain.request.CreateGameRequest
import at.karriere.battlebat.battlebat.service.GameService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping(value = "/game", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
class GameController {

    private final GameService gameService

    @Autowired
    GameController(final GameService gameService) {
        this.gameService = gameService
    }

    @RequestMapping(value = "/find/{id}")
    @ResponseBody
    Game findById(@PathVariable Long id) {
        println "ENDPOINT - GAME - GET BY ID"

        def game = gameService.getGame(id)

        return game
    }

    @RequestMapping(value = "/findAll")
    @ResponseBody
    List<Game> findAll() {
        println "ENDPOINT - GAME - FIND ALL"

        def games = gameService.getAllGames()

        return games
    }

    /*
    @RequestMapping(
            value = "/create",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    Long create(@RequestBody CreateGameRequest createGameRequest) {
        println "ENDPOINT - GAME - CREATE"

        def success = gameService.createGame(createGameRequest)

        return success
    }
    */

}
