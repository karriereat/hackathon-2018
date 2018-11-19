package at.karriere.battlebat.battlebat.domain

import java.sql.Blob

class Game {

    private Long id
    private String name
    private String rules
    private String picture

    Game() {
    }

    Game(final Long id, final String name, final String rules, final String picture) {
        this.id = id
        this.name = name
        this.rules = rules
        this.picture = picture
    }

    Long getId() {
        return id
    }

    void setId(final Long id) {
        this.id = id
    }

    String getName() {
        return name
    }

    void setName(final String name) {
        this.name = name
    }

    String getRules() {
        return rules
    }

    void setRules(final String rules) {
        this.rules = rules
    }

    String getPicture() {
        return picture
    }

    void setPicture(final String picture) {
        this.picture = picture
    }
}
