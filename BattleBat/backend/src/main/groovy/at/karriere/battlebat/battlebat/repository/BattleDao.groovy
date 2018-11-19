package at.karriere.battlebat.battlebat.repository

import at.karriere.battlebat.battlebat.domain.Battle
import at.karriere.battlebat.battlebat.domain.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BattleDao {

    private final GroovyConnection groovyConnection
    private final UserDao userDao

    @Autowired
    BattleDao(final GroovyConnection groovyConnection, UserDao userDao) {
        this.groovyConnection = groovyConnection
        this.userDao = userDao
    }

    List<Battle> getAllBattles() {
        List<Battle> battles = []
        // List values = []

        groovyConnection.getConnection().eachRow("SELECT * FROM battle ") { row ->
            User winner = userDao.getWinner(row.id)
            battles.add(new Battle(
                    id: row.id,
                    gameId: row.gameId,
                    name: row.name,
                    rules: row.rules,
                    status: row.status,
                    winner: winner
            ))
        }

        return battles
    }

    Battle getBattle(long battleId) {
        Battle battle = null

        Map params = [id: battleId]

        def row = groovyConnection.getConnection().firstRow("SELECT * FROM battle WHERE id=:id ", params)

        if (row != null) {
            User winner = userDao.getWinner(row.id)
            battle = new Battle(
                    id: row.id,
                    gameId: row.gameId,
                    name: row.name,
                    rules: row.rules,
                    status: row.status,
                    winner: winner
            )
        }

        return battle
    }

    Long createBattle(Battle battle) {
        Map params = [
                gameId: battle.gameId,
                name  : battle.name,
                rules : battle.rules,
                status: battle.status
        ]
        def ret = groovyConnection.getConnection().executeInsert("insert into battle (gameId, name, rules, status) values (:gameId, :name, :rules, :status) ", params)

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

    Boolean updateBattleStatus(Long battleId, Integer newBattleStatus) {
        Map params = [
                battleId       : battleId,
                newBattleStatus: newBattleStatus
        ]

        def ret = groovyConnection.getConnection().executeUpdate(
                "UPDATE battle SET status = :newBattleStatus WHERE id = :battleId", params
        )

        return ret == 1
    }

}
