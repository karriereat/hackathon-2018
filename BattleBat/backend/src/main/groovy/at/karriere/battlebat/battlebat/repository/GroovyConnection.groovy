package at.karriere.battlebat.battlebat.repository

import groovy.sql.Sql
import org.springframework.stereotype.Component

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Component
class GroovyConnection {

    private Sql userSql

    @PostConstruct
    private void setUp() {
        userSql = Sql.newInstance(
                "jdbc:mysql://192.168.1.109:27217/u38961db3?useSSL=false&requireSSL=false",
                "root",
                "karriere.at",
                "com.mysql.cj.jdbc.Driver"
        )

        /*
        userSql = Sql.newInstance(
                "jdbc:mysql://e36008-mysql.services.easyname.eu:3306/u38961db3?useSSL=false&requireSSL=false",
                "u38961db3",
                "b1ie.nn6",
                "com.mysql.cj.jdbc.Driver"
        )
        */
    }

    @PreDestroy
    private void preDestroy() {
        userSql.close()
    }

    Sql getConnection() {
        return userSql
    }


}
