# World Sync AI:

World Sync AI is a cloud-powered web application that integrates the capabilities of Google Cloud AI (Gemini, Vertex AI), MLB API, Google Calendar API, and Spring to provide a personalized experience for baseball fans.

The project was developed for the ["Google Cloud x MLB(TM) Hackathon – Building with Gemini Models"](https://devpost.com/software/project-fmbe1id7r0o2) hackathon to demonstrate the potential of Google Cloud AI in enhancing fan engagement and delivering personalized event planning.

## Technologies

🔹 **Google Cloud API:**

* **Google Calendar API** (authentication, match event management).

* **Vertex AI API (Gemini)** (intent analysis, generating contextual responses in AI chat).

* **Google AI Studio** (training and explanations in MLB Trivia).

🔹 **MLB API:**

* MLB Stats API (team data, schedules, players).

* Real-time data retrieval for teams, matches, and players.

🔹 **Backend:**

* **Java 23.0.1**, **Spring Boot 3.4.1 + Spring Security** (OAuth2), **Maven 3.9.9**.

* **Cloud SQL**, PostgreSQL (temporary storage for users, favorite teams, access tokens).

* **Google Secret Manager** (secure storage of API keys and credentialst).

🔹 **Frontend:**

* **React + TypeScript** (Vite 6.0.7, SPA).

* **State management & UI components** (interactive SPA experience).


🔹 **Deployment & Infrastructure:**

* **Google Cloud Run** (auto-scalable backend hosting).

* **Firebase Hosting** (frontend deployment).

🔹 **Tools:**

* IntelliJ IDEA Ultimate.

* Postman.

## Features

### Authentication

* Login via login page (JWT token).

* User registration: saving to Cloud SQL (email, password, username, access/refresh tokens Google OAuth2).

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

- Modify favorite teams (saved in Cloud SQL).

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

2️⃣ **Set Up Google Cloud Secrets**

1. Enable APIs → Vertex AI, Google Calendar API.
2. Store credentials in Google Secret Manager.


3️⃣ **Run Backend (Spring Boot)**

    mvn spring-boot:run

4️⃣ **Run Frontend (React + TypeScript)**


    cd frontend
    npm install
    npm start

5️⃣ **Check the App**

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