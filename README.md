<div align="center">

# PhotoForum 📸

### One Java REST API, two frontend implementations

<p>
  <img src="https://img.shields.io/badge/Java-E76F00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" title="Java — shared backend implementation" />
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" title="Spring Boot — shared REST API" />
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" title="Angular — first frontend implementation" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" title="Next.js — second frontend implementation" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" title="TypeScript — typed frontend development" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" title="Docker Compose — development and production environments" />
</p>

<p>
  <img src="https://img.shields.io/badge/Backend-Shared%20REST%20API-005571?style=flat-square" alt="Shared REST API" title="Both frontend applications use the same backend contract" />
  <img src="https://img.shields.io/badge/Auth-JWT%20cookies-6F42C1?style=flat-square" alt="JWT authentication" title="Access and refresh tokens handled through cookies" />
  <img src="https://img.shields.io/badge/Clients-Angular%20%2B%20Next.js-2EA44F?style=flat-square" alt="Angular and Next.js clients" title="Equivalent workflows implemented in Angular and Next.js" />
</p>

</div>

---

## Overview

PhotoForum is a full-stack photo-sharing application created to compare **Angular** and **Next.js** implementations under the same functional requirements.

Both clients communicate with one shared Java and Spring Boot REST API. This makes it possible to compare frontend structure and integration choices without changing the backend domain or API contract.

### Shared capabilities

- user registration and authentication
- access- and refresh-token workflows
- user profiles and avatars
- photo upload and storage
- public photo feed
- likes and favourites
- comments
- user-specific photo collections
- shared REST API contract
- separate development and production Docker environments

---

## Architecture

```mermaid
flowchart LR
    A["Angular client"]
    N["Next.js client"]
    API["Shared Spring Boot REST API"]
    DB[("PostgreSQL")]
    MEDIA["Photo and avatar storage"]

    A <-->|HTTPS / JSON| API
    N <-->|HTTPS / JSON| API
    API --> DB
    API --> MEDIA
```

The backend remains the common comparison baseline. Both frontend applications implement equivalent user workflows against the same endpoints.

---

## Frontend comparison

The project provides a practical foundation for comparing two frontend approaches against the same backend.

| Area | Angular client | Next.js client |
|---|---|---|
| Application model | Framework-led client application | React-based Next.js application |
| Language | TypeScript | TypeScript |
| Routing | Angular routing implementation | Next.js routing implementation |
| API integration | Angular HTTP layer | Client-side integration with the shared API |
| Authentication | Shared token and cookie contract | Shared token and cookie contract |
| Functional scope | Equivalent PhotoForum workflows | Equivalent PhotoForum workflows |
| Backend dependency | Shared Spring Boot API | Shared Spring Boot API |

The table intentionally describes the project architecture without claiming that one framework is universally better. Detailed conclusions should be based on the actual implementation and team experience.

---

## Technology stack

| Area | Technologies |
|---|---|
| Backend | Java, Spring Boot, REST APIs |
| Angular client | Angular, TypeScript |
| Next.js client | Next.js, React, TypeScript |
| Persistence | PostgreSQL |
| Authentication | Access and refresh tokens stored in cookies |
| Media | Photo and avatar storage |
| Delivery | Docker, Docker Compose |
| Transport | HTTPS in the configured environment |

---

## API overview

The backend exposes endpoints for:

- login, registration, logout and token refresh
- authorisation checks
- photo upload and retrieval
- likes, comments and favourites
- user profile details
- user-specific photo collections
- avatar and media retrieval

Move detailed request and response examples to a dedicated file such as:

```text
documentation/api.md
```

Then keep this README focused on project value, architecture and setup.

---

## Running the project

### Frontend development environment

```bash
docker compose -f compose.frontend.dev.yaml up --build --force-recreate
```

### Frontend production environment

```bash
docker compose -f compose.frontend.yaml up --build --force-recreate
```

### Backend development environment

```bash
docker compose -f compose.backend.dev.yaml up --build --force-recreate
```

### Backend production environment

```bash
docker compose -f compose.backend.yaml up --build --force-recreate
```

The backend requires its Spring application configuration, database credentials, JWT values and media-storage path. The root environment file supplies PostgreSQL configuration.

---

## Project structure

```text
.
├── backend/
├── frontend - angular/
├── frontend - next.js/
├── documentation/
├── mockups/
├── certs/
├── compose.backend.dev.yaml
├── compose.backend.yaml
├── compose.frontend.dev.yaml
└── compose.frontend.yaml
```
