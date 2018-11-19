package at.karriere.battlebat.battlebat.service

import at.karriere.battlebat.battlebat.domain.User
import at.karriere.battlebat.battlebat.domain.request.CreateUserRequest
import at.karriere.battlebat.battlebat.repository.UserDao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService {

    private final UserDao userDao

    @Autowired
    UserService(final UserDao userDao) {
        this.userDao = userDao
    }

    User getUser(final Long id) {
        return userDao.getUser(id)
    }

    List<User> getAllUsers() {
        return userDao.getAllUsers()
    }

    Long createUser(CreateUserRequest request) {
        return userDao.createUser(new User(
                id: null,
                name: request.name,
                email: request.email,
                firstname: request.firstname,
                surname: request.surname
        ))
    }

}
