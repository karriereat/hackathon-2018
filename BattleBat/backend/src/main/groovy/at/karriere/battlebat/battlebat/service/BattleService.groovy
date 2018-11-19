package at.karriere.battlebat.battlebat.service

import at.karriere.battlebat.battlebat.domain.Battle
import at.karriere.battlebat.battlebat.domain.Competitor
import at.karriere.battlebat.battlebat.repository.BattleDao
import at.karriere.battlebat.battlebat.repository.CompetitorDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BattleService {

    private final BattleDao battleDao
    private final CompetitorDao competitorDao
    private final EncounterService encounterService

    @Autowired
    BattleService(final BattleDao battleDao, final CompetitorDao competitorDao, final EncounterService encounterService) {
        this.battleDao = battleDao
        this.competitorDao = competitorDao
        this.encounterService = encounterService
    }

    Battle getBattle(final Long id) {
        return battleDao.getBattle(id)
    }

    List<Battle> getAllBattles() {
        return battleDao.getAllBattles()
    }

    Long createBattle(Long gameId, String name, String rules, Integer status) {
        return battleDao.createBattle(new Battle(
                id: null,
                gameId: gameId,
                name: name,
                rules: rules,
                status: status
        ))
    }

    Boolean start(Long battleId) {
        def battle = battleDao.getBattle(battleId)

        if (battle != null && battle.status == 0) {
            def competitors = competitorDao.getAllCompetitorsByBattleId(battleId)
            def encountersSuccessfullyCreated = encounterService.createFirstEncounters(competitors, battleId)

            if (encountersSuccessfullyCreated) {
                def successfullyUpdatedBattleStatus = battleDao.updateBattleStatus(battleId, 1)
                if (successfullyUpdatedBattleStatus) {
                    return true
                } else {
                    System.err.println("ERROR! Could not update battle status!")
                }
            } else {
                System.err.println("ERROR! Could not create encounters")
            }
        } else {
            System.err.println("ERROR! Cannot start a battle which does not exist or does not have status 0!")
        }

        return false
    }

}
