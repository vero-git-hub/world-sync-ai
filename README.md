# World Sync AI:

World Sync AI is a web application that integrates the capabilities of Google Cloud AI (Gemini, Vertex AI), MLB API, Google Calendar API, and Spring Security to provide a personalized experience for baseball fans.

The project World Sync AI was developed as part of the ["Google Cloud x MLB(TM) Hackathon – Building with Gemini Models"](https://devpost.com/software/world-sync-ai) hackathon to demonstrate the potential of Google Cloud AI in enhancing fan engagement and delivering personalized event planning.

## Technologies

🔹 **Google Cloud API:**

* **Google Calendar API** (authentication, match event management).

* **Vertex AI API (Gemini)** (intent analysis, generating contextual responses in AI chat).

* **Google AI Studio** (training and explanations in MLB Trivia).

🔹 **MLB API:**

* MLB Stats API (team data, schedules, players).

* Real-time data retrieval for teams, matches, and players.

🔹 **Backend:**

* **Java 23.0.1**, **Spring Boot 3.4.1 + Spring Security** (authentication, REST API), **Maven 3.9.9**.

* **H2 Database** (temporary storage for users, favorite teams, access tokens).

* **OAuth 2.0 (Google Authentication)** (Google login, token management).

🔹 **Frontend:**

* **React + TypeScript** (Vite 6.0.7, SPA, widget management, UI components).

* **Axios** (API requests, MLB and Google Cloud data processing).

🔹 **Tools:**

* IntelliJ IDEA Ultimate.

* Postman.

## Features

### Authentication

* Login via login page (Spring Security).

* User registration: saving to H2 Database (email, password, username, access/refresh tokens Google OAuth2).

* Connection to Google Calendar API via Google account login.

## Dashboard (Main Page)
The main page consists of several widgets:

1️⃣ **MLB Trivia (Gemini, Google AI Studio)**

- Trivia game based on MLB API ([Stats API](https://github.com/MajorLeagueBaseball/google-cloud-mlb-hackathon)).

- Generation of random questions and answers about team foundation years.

- **Gemini AI analyzes responses** and explains user mistakes.

2️⃣ **MLB AI Chat (Gemini, Vertex AI)**

- **User query intent detection** using **Gemini AI**.

- If the query is about a **team's schedule**, the chatbot retrieves data via MLB API:

   * Gets teamId from https://statsapi.mlb.com/api/v1/teams?sportId=1.

   * Requests the schedule from https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2025&gameType=R&teamId={teamId}.

- **Forms context** (original query + MLB API data) and **generates a response with Gemini**.

3️⃣ **Profile (User Profile)**

- User data from the database (name, email, favorite teams).

- Modify favorite teams (saved in H2 Database).

- Access token verification for Google Calendar API.

4️⃣ **Schedule (Match Schedule)**

- **Loaded from MLB API**: https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2025&gameType=R.

- **Filtering features**:

   * By date.

   * By team.

   * Reset filters.

- **Pagination**.

- **Display only user's favorite teams / toggle to show all teams**.

- **Sorting by favorite teams** (button to modify favorite teams list).

- **Match card**:

   * Team logos.

   * Match date.

   * **Button to add to Google Calendar**.

   * Clicking opens **team information, roster, and player details**.

5️⃣ **Teams (MLB Teams)**

- **Retrieve all teams from MLB API**: https://statsapi.mlb.com/api/v1/teams?sportId=1.

- Team card:

   * Logo, city, stadium.

   * Clicking opens detailed team information:

      * https://statsapi.mlb.com/api/v1/teams/{teamId}.

      * Team roster: https://statsapi.mlb.com/api/v1/teams/{teamId}/roster?season=2025.

      * Player details page: https://statsapi.mlb.com/api/v1/people/{playerId} (displays personal data: birthdate, age, weight, height, etc.).

## Installation

1️⃣ **Clone the repository**

    git clone https://github.com/vero-git-hub/world-sync-ai
    cd world-sync-ai

2️⃣ **Install dependencies**

    mvn clean install

3️⃣ **Configure Google Cloud Credentials**

1. Go to **Google Cloud Console**.

2. Enable Vertex AI API, Google Calendar API.

3. Create **OAuth 2.0 Client ID**, add redirect URI.

4. Download JSON file google-credentials.json and place it in src/main/resources/.

5. Add to application-local.properties:
    ```
    google.oauth2.client-id=your-client-id
    google.oauth2.client-secret=your-client-secret
    google.oauth2.redirect-uri=http://localhost:8080/login/oauth2/code/google
   
    google.cloud.credentials=classpath:google-credentials.json
    google.cloud.project-id=your-project-id
    google.cloud.location=us-central1
    google.cloud.model-name=gemini
   
    google.cloud.gemini.max-tokens=200
    google.cloud.gemini.temperature=0.7

    gemini.api.key=your-gemini-api-key
    gemini.api.url=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
    ```

4️⃣ **Run Backend (Spring Boot)**

    mvn spring-boot:run

5️⃣ **Run Frontend (React + TypeScript)**

    cd frontend
    npm install
    npm start

6️⃣ **Check your app**

Open your browser and navigate to http://localhost:8080.

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
    ```
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```
    git commit -m "Added new feature"
    ```
4. Push your branch:
    ```
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.