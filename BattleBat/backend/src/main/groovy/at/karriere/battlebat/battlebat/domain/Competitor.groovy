package at.karriere.battlebat.battlebat.domain

class Competitor {

    private Long id
    private Long battleId
    private Long userId

    Competitor() {
    }

    Competitor(final Long id, final Long battleId, final Long userId) {
        this.id = id
        this.battleId = battleId
        this.userId = userId
    }

    Long getId() {
        return id
    }

    void setId(final Long id) {
        this.id = id
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
