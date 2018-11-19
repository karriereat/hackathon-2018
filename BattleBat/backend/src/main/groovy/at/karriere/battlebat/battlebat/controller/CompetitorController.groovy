package at.karriere.battlebat.battlebat.controller


import at.karriere.battlebat.battlebat.domain.Competitor
import at.karriere.battlebat.battlebat.domain.request.CreateCompetitorRequest
import at.karriere.battlebat.battlebat.service.CompetitorService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping(value = "/competitor", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
class CompetitorController {

    private final CompetitorService competitorService

    @Autowired
    CompetitorController(final CompetitorService competitorService) {
        this.competitorService = competitorService
    }

    @RequestMapping(value = "/find/{id}")
    @ResponseBody
    Competitor findById(@PathVariable Long id) {
        println "ENDPOINT - COMPETITOR - GET BY ID"

        def competitor = competitorService.getCompetitor(id)

        return competitor
    }

    @RequestMapping(value = "/find/battle-id/{battleId}")
    @ResponseBody
    List<Competitor> findByBattleId(@PathVariable Long battleId) {
        println "ENDPOINT - COMPETITOR - GET BY BATTLE ID"

        def competitors = competitorService.getCompetitorsByBattleId(battleId)

        return competitors
    }

    @RequestMapping(value = "/findAll")
    @ResponseBody
    List<Competitor> findAll() {
        println "ENDPOINT - COMPETITOR - FIND ALL"

        def competitors = competitorService.getAllCompetitors()

        return competitors
    }

    @RequestMapping(
            value = "/create",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    Long create(@RequestBody CreateCompetitorRequest createCompetitorRequest) {
        println "ENDPOINT - COMPETITOR - CREATE"

        def success = competitorService.createCompetitor(createCompetitorRequest)

        return success
    }

}
