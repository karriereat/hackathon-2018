package at.karriere.battlebat.battlebat.repository

import at.karriere.battlebat.battlebat.domain.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class UserDao {

    private final GroovyConnection groovyConnection

    @Autowired
    UserDao(final GroovyConnection groovyConnection) {
        this.groovyConnection = groovyConnection
    }

    List<User> getAllUsers() {
        List<User> users = []

        groovyConnection.getConnection().eachRow("SELECT * FROM user ") { row ->
            users.add(new User(
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    firstname: row.firstname,
                    surname: row.surname
            ))
        }

        return users
    }

    User getUser(long userId) {
        User user = null

        Map params = [id: userId]

        def row = groovyConnection.getConnection().firstRow("SELECT * FROM user WHERE id=:id ", params)

        if (row != null) {
            user = new User(
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    firstname: row.firstname,
                    surname: row.surname
            )
        }

        return user
    }

    Long createUser(User user) {
        Map params = [
                name: user.name,
                email: user.email,
                firstname: user.firstname,
                surname: user.surname
        ]

        def ret = groovyConnection.getConnection().executeInsert("INSERT INTO user (name, email, firstname, surname) values (:name, :email, :firstname, :surname) ", params)

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

    User getWinner(final Long battleId) {
        User user = null

        Map params = [battleId: battleId]

        def row = groovyConnection.getConnection().firstRow(
                "SELECT c.userId FROM battle b " +
                "JOIN encounter e on e.battleId = b.id " +
                "JOIN competitor c on c.id = e.winnerId " +
                "WHERE b.id = :battleId " +
                "AND b.status = 2 " +
                "AND NOT EXISTS (SELECT 1 FROM encounter prevEnc WHERE prevEnc.battleId = e.battleId and prevEnc.round > e.round)", params)

        if (row != null) {
            user = getUser(row.userId)
        }

        return user

    }

}
