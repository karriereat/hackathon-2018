package at.karriere.battlebat.battlebat.service


import at.karriere.battlebat.battlebat.domain.Competitor
import at.karriere.battlebat.battlebat.domain.Encounter
import at.karriere.battlebat.battlebat.domain.response.EncountersResponse
import at.karriere.battlebat.battlebat.repository.BattleDao
import at.karriere.battlebat.battlebat.repository.CompetitorDao
import at.karriere.battlebat.battlebat.repository.EncounterDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import java.util.stream.Collectors

@Service
class EncounterService {

    private final EncounterDao encounterDao
    private final CompetitorDao competitorDao
    private final BattleDao battleDao

    @Autowired
    EncounterService(final EncounterDao encounterDao, final CompetitorDao competitorDao, final BattleDao battleDao) {
        this.encounterDao = encounterDao
        this.competitorDao = competitorDao
        this.battleDao = battleDao
    }

    Encounter getEncounter(long id) {
        return encounterDao.getEncounter(id)
    }

    List<EncountersResponse> getEncountersByBattleId(final Long battleId) {
        Map<Integer, EncountersResponse> encountersMap = [:]

        def encounters = encounterDao.getAllEncountersByBattleId(battleId)
        encounters.each {
            if (!encountersMap.containsKey(it.round)) {
                encountersMap.put(it.round, new EncountersResponse(it.round))
            }

            encountersMap.get(it.round).encounters.add(it)
        }

        def response = encountersMap.values().stream().collect(Collectors.toList())

        return response
    }

    Long createEncounter(Long battleId, Integer round, Long competitorId, Long opponentId) {
        def competitorIsInBattle = competitorDao.isCompetitorInBattle(competitorId, battleId)
        def opponentIsInBattle = competitorDao.isCompetitorInBattle(opponentId, battleId)

        if (competitorIsInBattle && opponentIsInBattle) {
            return encounterDao.createEncounter(new Encounter(
                    id: null,
                    battleId: battleId,
                    round: round,
                    competitorId: competitorId,
                    opponentId: opponentId,
                    winnerId: null,
                    result: null
            ))
        } else {
            println "ERROR! One of the participants is not in the battle!"
            return null
        }
    }

    Boolean updateEncounter(Long encounterId, Long winnerId, String result) {
        if (!encounterDao.updateEncounter(encounterId, winnerId, result)) {
            return false
        }

        Encounter encounter = encounterDao.getEncounter(encounterId)
        if (encounterDao.getCountPendingEncountersInBattle(encounter.battleId) == 0) {
            List<Competitor> winners = competitorDao.getAllWinningCompetitorsByBattleId(encounter.battleId)
            if (winners.size() == 1) {
                //battle is over
                battleDao.updateBattleStatus(encounter.battleId, 2)
            } else {
                createNextEncounters(winners, encounter.battleId)
            }
        }

        return true
    }

    private boolean isPowerOfTwo(int number) {
        return number > 1 && ((number & (number - 1)) == 0)
    }

    int nextPowerOfTwo(int n) {
        int count = 0;

        // First n in the below
        // condition is for the
        // case where n is 0
        if (n > 0 && (n & (n - 1)) == 0)
            return n;

        while (n != 0) {
            n >>= 1;
            count += 1;
        }

        return 1 << count;
    }

    boolean createFirstEncounters(final List<Competitor> competitors, long battleId) {
        if (!isPowerOfTwo(competitors.size())) {
            println "WARNING! Filling competitors with wildcard!"

            int missing = nextPowerOfTwo(competitors.size()) - competitors.size()
            (1..missing).each {
                competitors.add(new Competitor(0 - it, battleId, -1))
            }
        }

        List<Long> competitorIds = competitors.stream().map { competitor -> competitor.id }.collect(Collectors.toList())

        List<Tuple2<Long, Long>> tuples = []
        while (true) {
            // shuffle
            Collections.shuffle(competitorIds)

            tuples = getTuples(competitorIds)

            boolean noTwoWildcards = checkTuples(tuples)

            if (noTwoWildcards) break
        }

        // create encounnters
        tuples.each {
            Long opponentId = it.second < 0 ? null : it.second

            encounterDao.createEncounter(new Encounter(
                    id: null,
                    battleId: battleId,
                    round: 1,
                    competitorId: it.first,
                    opponentId: opponentId,
                    winnerId: null,
                    result: null
            ))
        }

        return true
    }

    List<Tuple2<Long, Long>> getTuples(List<Long> competitorIds) {
        def tuples = []
        for (int i = 0; i < competitorIds.size(); i += 2) {
            tuples.add(new Tuple2<Long, Long>(competitorIds[i], competitorIds[i + 1]))
        }

        return tuples
    }

    boolean checkTuples(List<Tuple2<Long, Long>> tuples) {
        boolean ok = true

        tuples.each {
            if (it.first < 0 && it.second < 0) {
                ok = false
            }
        }

        return ok
    }

    boolean createNextEncounters(final List<Competitor> competitors, long battleId) {
        List<Long> competitorIds = competitors.stream().map { competitor -> competitor.id }.collect(Collectors.toList())

        List<Tuple2<Long, Long>> tuples = []
        tuples = getTuples(competitorIds)

        Integer nextRound = encounterDao.getCurrentRoundInBattle(battleId) + 1

        // create encounnters
        tuples.each {
            Long opponentId = it.second < 0 ? null : it.second

            encounterDao.createEncounter(new Encounter(
                    id: null,
                    battleId: battleId,
                    round: nextRound,
                    competitorId: it.first,
                    opponentId: opponentId,
                    winnerId: null,
                    result: null
            ))
        }

        return true
    }
}
