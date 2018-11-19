package at.karriere.battlebat.battlebat.domain.request

class UpdateEncounterRequest {

    private Long encounterId
    private Long winnerId
    private String result

    UpdateEncounterRequest() {
    }

    UpdateEncounterRequest(final Long encounterId, final Long winnerId, final String result) {
        this.encounterId = encounterId
        this.winnerId = winnerId
        this.result = result
    }

    Long getEncounterId() {
        return encounterId
    }

    void setEncounterId(Long encounterId) {
        this.encounterId = encounterId
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
