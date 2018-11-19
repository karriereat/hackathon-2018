package at.karriere.battlebat.battlebat.domain.request

class CreateBattleRequest {

    private Long    gameId
    private String  name
    private String  rules
    private Integer status

    CreateBattleRequest() {
    }

    CreateBattleRequest(final Long gameId, final String name, final String rules, final Integer status) {
        this.gameId = gameId
        this.name = name
        this.rules = rules
        this.status = status
    }

    Long getGameId() {
        return gameId
    }

    void setGameId(final Long gameId) {
        this.gameId = gameId
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

    Integer getStatus() {
        return status
    }

    void setStatus(final Integer status) {
        this.status = status
    }
}
