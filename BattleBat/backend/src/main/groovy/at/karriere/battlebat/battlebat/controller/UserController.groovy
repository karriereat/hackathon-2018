package at.karriere.battlebat.battlebat.controller


import at.karriere.battlebat.battlebat.domain.User
import at.karriere.battlebat.battlebat.domain.request.CreateUserRequest
import at.karriere.battlebat.battlebat.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping(value = "/user", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
class UserController {

    private final UserService userService

    @Autowired
    UserController(final UserService userService) {
        this.userService = userService
    }

    @RequestMapping(value = "/find/{id}")
    @ResponseBody
    User findById(@PathVariable Long id) {
        println "ENDPOINT - USER - GET BY ID"

        def user = userService.getUser(id)

        return user
    }

    @RequestMapping(value = "/findAll")
    @ResponseBody
    List<User> findAll() {
        println "ENDPOINT - USER - FIND ALL"

        def users = userService.getAllUsers()

        return users
    }

    @RequestMapping(
            value = "/create",
            method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    Long create(@RequestBody CreateUserRequest createUserRequest) {
        println "ENDPOINT - USER - CREATE"

        def success = userService.createUser(createUserRequest)

        return success
    }

}
