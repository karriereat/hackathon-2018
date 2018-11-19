package at.karriere.battlebat.battlebat.controller

import at.karriere.battlebat.battlebat.domain.Encounter
import at.karriere.battlebat.battlebat.domain.request.CreateEncounterRequest
import at.karriere.battlebat.battlebat.domain.request.UpdateEncounterRequest
import at.karriere.battlebat.battlebat.domain.response.EncountersResponse
import at.karriere.battlebat.battlebat.service.EncounterService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping(value = "/encounter", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)

class EncounterController {

    private final EncounterService encounterService

    @Autowired
    EncounterController(EncounterService encounterService) {
        this.encounterService = encounterService
    }

    @RequestMapping(value = "/find/{id}")
    @ResponseBody
    Encounter findById(@PathVariable Long id) {
        println "ENDPOINT - ENCOUNTER - GET BY ID"
        return encounterService.getEncounter(id)
    }

    @RequestMapping(value = "/find/battle-id/{battleId}")
    @ResponseBody
    List<EncountersResponse> findByBattleId(@PathVariable Long battleId) {
        println "ENDPOINT - ENCOUNTER - GET BY BATTLE ID"

        def encounters = encounterService.getEncountersByBattleId(battleId)

        return encounters
    }

    @CrossOrigin
    @RequestMapping(
            value = "/create",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    Long create(@RequestBody CreateEncounterRequest createEncounterRequest) {
        println "ENDPOINT - ENCOUNTER - CREATE"

        def success = encounterService.createEncounter(
                createEncounterRequest.battleId,
                createEncounterRequest.round,
                createEncounterRequest.competitorId,
                createEncounterRequest.opponentId
        )

        return success
    }

    @RequestMapping(
            value = "/update",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    Boolean update(@RequestBody UpdateEncounterRequest updateEncounterRequest) {
        println "ENDPOINT - ENCOUNTER - UPDATE"

        // TODO: check if winnerid in competitor or opponent id

        def success = encounterService.updateEncounter(
                updateEncounterRequest.encounterId,
                updateEncounterRequest.winnerId,
                updateEncounterRequest.result
        )

        return success
    }
}
