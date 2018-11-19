package at.karriere.battlebat.battlebat.service


import at.karriere.battlebat.battlebat.domain.Competitor
import at.karriere.battlebat.battlebat.domain.request.CreateCompetitorRequest
import at.karriere.battlebat.battlebat.repository.BattleDao
import at.karriere.battlebat.battlebat.repository.CompetitorDao
import at.karriere.battlebat.battlebat.repository.UserDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CompetitorService {

    private final CompetitorDao competitorDao
    private final BattleDao battleDao
    private final UserDao userDao

    @Autowired
    CompetitorService(final CompetitorDao competitorDao, final BattleDao battleDao, final UserDao userDao) {
        this.competitorDao = competitorDao
        this.battleDao = battleDao
        this.userDao = userDao
    }

    Competitor getCompetitor(final Long id) {
        return competitorDao.getCompetitor(id)
    }

    List<Competitor> getAllCompetitors() {
        return competitorDao.getAllCompetitors()
    }

    List<Competitor> getCompetitorsByBattleId(final Long battleId) {
        return competitorDao.getAllCompetitorsByBattleId(battleId)
    }

    Long createCompetitor(CreateCompetitorRequest request) {
        // check if valid params
        def battle = battleDao.getBattle(request.battleId)
        def user = userDao.getUser(request.userId)

        if (battle != null && user != null) {
            return competitorDao.createCompetitor(new Competitor(
                    id: null,
                    battleId: request.battleId,
                    userId: request.userId
            ))
        } else {
            println "Could not find battle or user for specified ids!"
            return null
        }
    }

}
