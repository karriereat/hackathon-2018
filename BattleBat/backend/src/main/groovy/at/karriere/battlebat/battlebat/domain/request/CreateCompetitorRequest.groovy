package at.karriere.battlebat.battlebat.domain.request

class CreateCompetitorRequest {

    private Long battleId
    private Long userId

    CreateCompetitorRequest() {
    }

    CreateCompetitorRequest(final Long battleId, final Long userId) {
        this.battleId = battleId
        this.userId = userId
    }

    Long getBattleId() {
        return battleId
    }

    void setBattleId(final Long battleId) {
        this.battleId = battleId
    }

    Long getUserId() {
        return userId
    }

    void setUserId(final Long userId) {
        this.userId = userId
    }

}
