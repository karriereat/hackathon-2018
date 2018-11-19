package at.karriere.battlebat.battlebat.domain

class Battle {

    private Long id
    private Long gameId
    private String name
    private String rules
    private Integer status
    private User winner

    Battle() {
    }

    Battle(final Long id, final Long gameId, final String name, final String rules, final Integer status, User winner) {
        this.id = id
        this.gameId = gameId
        this.name = name
        this.rules = rules
        this.status = status
        this.winner = winner
    }

    Long getId() {
        return id
    }

    void setId(final Long id) {
        this.id = id
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

    User getWinner() {
        return winner
    }

    void setWinner(User winner) {
        this.winner = winner
    }
}
