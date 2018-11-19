package at.karriere.battlebat.battlebat.controller

import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
@RequestMapping(value = "/status", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
class StatusController {

    @RequestMapping(value = "/ping", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String ping() {
        println "pong"

        return "pong"
    }

}
