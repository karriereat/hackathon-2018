package at.karriere.battlebat.battlebat.domain.request

class CreateUserRequest {

    private String name
    private String email
    private String firstname
    private String surname

    CreateUserRequest() {
    }

    CreateUserRequest(final String name, final String email, final String firstname, final String surname) {
        this.name = name
        this.email = email
        this.firstname = firstname
        this.surname = surname
    }

    String getName() {
        return name
    }

    void setName(final String name) {
        this.name = name
    }

    String getEmail() {
        return email
    }

    void setEmail(final String email) {
        this.email = email
    }

    String getFirstname() {
        return firstname
    }

    void setFirstname(final String firstname) {
        this.firstname = firstname
    }

    String getSurname() {
        return surname
    }

    void setSurname(final String surname) {
        this.surname = surname
    }

}
