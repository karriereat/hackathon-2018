package at.karriere.battlebat.battlebat.repository

import at.karriere.battlebat.battlebat.domain.Encounter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class EncounterDao {

    private final GroovyConnection groovyConnection

    @Autowired
    EncounterDao(final GroovyConnection groovyConnection) {
        this.groovyConnection = groovyConnection
    }

    Encounter getEncounter(long id) {
        Encounter encounter = null

        Map params = [id: id]

        def row = this.groovyConnection.getConnection().firstRow(
                "SELECT * FROM encounter WHERE id = :id", params
        )

        if (row != null) {
            encounter = new Encounter(
                    id: row.id,
                    battleId: row.battleId,
                    round: row.round,
                    competitorId: row.competitorId,
                    opponentId: row.opponentId,
                    winnerId: row.winnerId,
                    result: row.result
            )
        }

        return encounter
    }

    List<Encounter> getAllEncountersByBattleId(final Long battleId) {
        List<Encounter> encounters = []

        Map params = [battleId: battleId]

        groovyConnection.getConnection().eachRow("SELECT * FROM encounter WHERE battleId = :battleId ", params) { row ->
            encounters.add(new Encounter(
                    id: row.id,
                    battleId: row.battleId,
                    round: row.round,
                    competitorId: row.competitorId,
                    opponentId: row.opponentId,
                    winnerId: row.winnerId,
                    result: row.result
            ))
        }

        return encounters
    }

    Long createEncounter(Encounter encounter) {
        Map params = [
                battleId    : encounter.battleId,
                round       : encounter.round,
                competitorId: encounter.competitorId,
                opponentId  : encounter.opponentId
        ]

        def ret = groovyConnection.getConnection().executeInsert(
                "INSERT INTO encounter(battleId, round, competitorId, opponentId) VALUES (:battleId, :round, :competitorId, :opponentId)", params)

        if (!ret.isEmpty()) {
            try {
                Long l = new Long(ret.get(0).get(0).toString())

                return l
            } catch (Exception ignore) {
                return null
            }
        } else {
            return null
        }
    }

    Boolean updateEncounter(Long encounterId, Long winnerId, String result) {
        Map params = [
                encounterId: encounterId,
                winnerId   : winnerId,
                result     : result
        ]

        def ret = groovyConnection.getConnection().executeUpdate(
                "UPDATE encounter SET winnerId = :winnerId, result = :result WHERE id = :encounterId",
                params
        )

        return ret == 1
    }

    Integer getCountPendingEncountersInBattle(final Long battleId) {

        Map params = [battleId: battleId]

        def ret = groovyConnection.getConnection().firstRow(
                "SELECT count(*) as countEncounters FROM encounter WHERE battleId = :battleId AND winnerId is NULL", params)

        return new Long(ret.get("countEncounters"))
    }

    Integer getCurrentRoundInBattle(final Long battleId) {
        Map params = [battleId: battleId]

        def ret = groovyConnection.getConnection().firstRow(
                "SELECT max(round) as currentRound FROM encounter WHERE battleId = :battleId", params)

        return new Long(ret.get("currentRound"))

    }
}
