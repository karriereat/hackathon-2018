package at.karriere.battlebat.battlebat.domain.response

import at.karriere.battlebat.battlebat.domain.Encounter

class EncountersResponse {

    private Integer round
    private List<Encounter> encounters = []

    EncountersResponse() {
    }

    EncountersResponse(final Integer round) {
        this.round = round
        this.encounters = []
    }

    EncountersResponse(final Integer round, final List<Encounter> encounters) {
        this.round = round
        this.encounters = encounters
    }

    Integer getRound() {
        return round
    }

    void setRound(final Integer round) {
        this.round = round
    }

    List<Encounter> getEncounters() {
        return encounters
    }

    void setEncounters(final List<Encounter> encounters) {
        this.encounters = encounters
    }

}
