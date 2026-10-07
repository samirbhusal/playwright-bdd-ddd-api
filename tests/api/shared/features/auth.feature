@api
Feature: Auth Feature

    As a user, I want to be able to authenticate with the API, so that I can access protected resources.

    Background:
        Given user launches the api services

    @API-001
    Scenario: Verify Auth API with valid credentials
        When user sends POST request to "auth/login" with valid credentials
            | email    | qa@demo.io  |
            | password | Password123 |
        Then user verifies the response data
            | email | qa@demo.io   |
            | name  | QA Demo User |
            | role  | admin        |

    @API-002
    Scenario Outline: Verify Auth API with invalid credentials
        When user sends POST request to "auth/login" with invalid credentials
            | email    | <email>    |
            | password | <password> |
        Then user verifies the response data
            | code          | <code>          |
            | status        | <status>        |
            | message       | <message>       |
            | emailField    | <emailField>    |
            | passwordField | <passwordField> |
        Examples:
            | email      | password    | status | code                | message                         | emailField        | passwordField        |
            | qa@demo.io | qa@demo.io  | 401    | INVALID_CREDENTIALS | Email or password is incorrect. |                   |                      |
            | qa@dem.io  | Password123 | 401    | INVALID_CREDENTIALS | Email or password is incorrect. |                   |                      |
            |            |             | 422    | VALIDATION_ERROR    | Invalid login payload.          | email is required | password is required |
            |            | Password123 | 422    | VALIDATION_ERROR    | Invalid login payload.          | email is required |                      |
            | qa@demo.io |             | 422    | VALIDATION_ERROR    | Invalid login payload.          |                   | password is required |
