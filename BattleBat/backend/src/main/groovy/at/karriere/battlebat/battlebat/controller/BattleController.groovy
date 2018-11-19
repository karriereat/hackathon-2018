package at.karriere.battlebat.battlebat.controller

import at.karriere.battlebat.battlebat.domain.Battle
import at.karriere.battlebat.battlebat.domain.request.CreateBattleRequest
import at.karriere.battlebat.battlebat.service.BattleService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping(value = "/battle", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
class BattleController {

    private final BattleService battleService

    @Autowired
    BattleController(final BattleService battleService) {
        this.battleService = battleService
    }

    @RequestMapping(value = "/start/{id}")
    @ResponseBody
    Boolean startBattle(@PathVariable Long id) {
        println "ENDPOINT - BATTLE - START"

        def battle = battleService.start(id)

        return battle
    }

    @RequestMapping(value = "/find/{id}")
    @ResponseBody
    Battle findById(@PathVariable Long id) {
        println "ENDPOINT - BATTLE - GET BY ID"

        def battle = battleService.getBattle(id)

        return battle
    }

    @RequestMapping(value = "/findAll")
    @ResponseBody
    List<Battle> findAll() {
        println "ENDPOINT - BATTLES - FIND ALL"

        def battles = battleService.getAllBattles()

        return battles
    }

    @RequestMapping(
            value = "/create",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    Long create(@RequestBody CreateBattleRequest createBattleRequest) {
        println "ENDPOINT - BATTLES - CREATE"

        def success = battleService.createBattle(
                createBattleRequest.gameId,
                createBattleRequest.name,
                createBattleRequest.rules,
                createBattleRequest.status
        )

        return success
    }

}
