package at.karriere.battlebat.battlebat.domain

class Encounter {

    private Long id
    private Long battleId
    private Integer round
    private Long competitorId
    private Long opponentId
    private Long winnerId
    private String result

    Encounter() {
    }

    Encounter(final Long id, final Long battleId, final Integer round, final Long competitorId, final Long opponentId, final Long winnerId, final String result) {
        this.id = id
        this.battleId = battleId
        this.round = round
        this.competitorId = competitorId
        this.opponentId = opponentId
        this.winnerId = winnerId
        this.result = result
    }

    Long getId() {
        return id
    }

    void setId(Long id) {
        this.id = id
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

    Long getWinnerId() {
        return winnerId
    }

    void setWinnerId(Long winnerId) {
        this.winnerId = winnerId
    }

    String getResult() {
        return result
    }

    void setResult(String result) {
        this.result = result
    }

}
