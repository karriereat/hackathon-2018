package at.karriere.battlebat.battlebat.repository

import at.karriere.battlebat.battlebat.domain.Competitor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class CompetitorDao {

    private final GroovyConnection groovyConnection

    @Autowired
    CompetitorDao(final GroovyConnection groovyConnection) {
        this.groovyConnection = groovyConnection
    }

    List<Competitor> getAllCompetitors() {
        List<Competitor> competitors = []

        groovyConnection.getConnection().eachRow("SELECT * FROM competitor ") { row ->
            competitors.add(new Competitor(
                    id: row.id,
                    battleId: row.battleId,
                    userId: row.userId
            ))
        }

        return competitors
    }

    List<Competitor> getAllCompetitorsByBattleId(final Long battleId) {
        List<Competitor> competitors = []

        Map params = [battleId: battleId]

        groovyConnection.getConnection().eachRow("SELECT * FROM competitor WHERE battleId = :battleId ", params) { row ->
            competitors.add(new Competitor(
                    id: row.id,
                    battleId: row.battleId,
                    userId: row.userId
            ))
        }

        return competitors
    }

    Competitor getCompetitor(long competitorId) {
        Competitor competitor = null

        Map params = [id: competitorId]

        def row = groovyConnection.getConnection().firstRow("SELECT * FROM competitor WHERE id=:id ", params)

        if (row != null) {
            competitor = new Competitor(
                    id: row.id,
                    battleId: row.battleId,
                    userId: row.userId
            )
        }

        return competitor
    }

    Boolean isCompetitorInBattle(Long competitorId, Long battleId) {
        Map params = [
                competitorId: competitorId,
                battleId    : battleId
        ]

        def row = groovyConnection.getConnection().firstRow("SELECT * FROM competitor WHERE id=:competitorId AND battleId=:battleId ", params)

        return row != null
    }

    Long createCompetitor(Competitor competitor) {
        Map params = [
                battleId: competitor.battleId,
                userId  : competitor.userId
        ]

        def ret = groovyConnection.getConnection().executeInsert("insert into competitor (battleId, userId) values (:battleId, :userId) ", params)

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

    List<Competitor> getAllWinningCompetitorsByBattleId(final Long battleId) {
        List<Competitor> competitors = []

        Map params = [battleId: battleId]

        groovyConnection.getConnection().eachRow(
                "select encounter.winnerId as winnerId, encounter.battleId as battleId, competitor.userId as userId " +
                        "from competitor " +
                        "join encounter on encounter.winnerId = competitor.id " +
                        "where encounter.battleId = :battleId " +
                        "and not exists (select 1 from encounter prevRounds where prevRounds.battleId = encounter.battleId and prevRounds.round > encounter.round)", params) { row ->
            competitors.add(new Competitor(
                    id: row.winnerId,
                    battleId: row.battleId,
                    userId: row.userId
            ))
        }

        return competitors
    }

}
