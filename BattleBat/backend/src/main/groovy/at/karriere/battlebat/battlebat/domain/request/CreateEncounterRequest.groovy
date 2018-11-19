package at.karriere.battlebat.battlebat.domain.request

class CreateEncounterRequest {

    private Long battleId
    private Integer round
    private Long competitorId
    private Long opponentId

    CreateEncounterRequest() {
    }

    CreateEncounterRequest(final Long battleId, final Integer round, final Long competitorId, final Long opponentId) {
        this.battleId = battleId
        this.round = round
        this.competitorId = competitorId
        this.opponentId = opponentId
    }

    Long getBattleId() {
        return battleId
    }

    void setBattleId(Long battleId) {
        this.battleId = battleId
    }

    Integer getRound() {
        return round
    }

    void setRound(Integer round) {
        this.round = round
    }

    Long getCompetitorId() {
        return competitorId
    }

    void setCompetitorId(Long competitorId) {
        this.competitorId = competitorId
    }

    Long getOpponentId() {
        return opponentId
    }

    void setOpponentId(Long opponentId) {
        this.opponentId = opponentId
    }

}
