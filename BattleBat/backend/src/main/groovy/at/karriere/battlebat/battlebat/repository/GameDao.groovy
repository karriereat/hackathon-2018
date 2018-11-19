package at.karriere.battlebat.battlebat.repository

import at.karriere.battlebat.battlebat.domain.Game
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class GameDao {

    private final GroovyConnection groovyConnection

    @Autowired
    GameDao(final GroovyConnection groovyConnection) {
        this.groovyConnection = groovyConnection
    }

    List<Game> getAllGames() {
        List<Game> games = []

        groovyConnection.getConnection().eachRow("SELECT * FROM game ") { row ->
            String base64picture = null
            try {
                base64picture = row.picture.encodeBase64().toString()
            } catch (Exception ignore) {

            }

            games.add(new Game(
                    id: row.id,
                    name: row.name,
                    rules: row.rules,
                    picture: base64picture
            ))
        }

        return games
    }

    Game getGame(long gameId) {
        Game game = null

        Map params = [id: gameId]

        def row = groovyConnection.getConnection().firstRow("SELECT * FROM game WHERE id=:id ", params)

        if (row != null) {
            game = new Game(
                    id: row.id,
                    name: row.name,
                    rules: row.rules,
                    picture: row.picture
            )
        }

        return game
    }

    Long createGame(Game game) {
        Map params = [
                name   : game.name,
                rules  : game.rules,
                picture: game.picture
        ]

        def ret = groovyConnection.getConnection().executeInsert("INSERT INTO game (name, rules, picture) values (:name, :rules, :picture) ", params)

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

}
