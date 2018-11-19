package at.karriere.battlebat.battlebat.domain.request

import java.sql.Blob

class CreateGameRequest {

    private String name
    private String rules
    private Blob picture

    CreateGameRequest() {
    }

    CreateGameRequest(final String name, final String rules, final Blob picture) {
        this.id = id
        this.name = name
        this.rules = rules
        this.picture = picture
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

    Blob getPicture() {
        return picture
    }

    void setPicture(final Blob picture) {
        this.picture = picture
    }

}
