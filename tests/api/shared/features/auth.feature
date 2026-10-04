@api
Feature: Auth Feature

    As a user, I want to be able to authenticate with the API, so that I can access protected resources.

    @API-001
    Scenario: Verify Auth API is available
        Given user launches the api services
        When user sends POST request to "auth/login" with valid credentials
            | email    | qa@demo.io  |
            | password | Password123 |
        Then user verifies the response data
