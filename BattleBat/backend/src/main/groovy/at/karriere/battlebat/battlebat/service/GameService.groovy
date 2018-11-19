package at.karriere.battlebat.battlebat.service

import at.karriere.battlebat.battlebat.domain.Game
import at.karriere.battlebat.battlebat.domain.request.CreateGameRequest
import at.karriere.battlebat.battlebat.repository.GameDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class GameService {

    private final GameDao gameDao

    @Autowired
    GameService(final GameDao gameDao) {
        this.gameDao = gameDao
    }

    Game getGame(final Long id) {
        return gameDao.getGame(id)
    }

    List<Game> getAllGames() {
        return gameDao.getAllGames()
    }

    Long createGame(CreateGameRequest request) {
        return gameDao.createGame(new Game(
                id: null,
                name: request.name,
                email: request.email,
                firstname: request.firstname,
                surname: request.surname
        ))
    }

}
