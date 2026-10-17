# Task Manager — Django + React

A full-stack task management web application built with **Django REST Framework** and **React**. It supports user registration, token-based login, and task management through a web interface.

## Tech stack

- **Backend:** Python, Django 5.2, Django REST Framework
- **Frontend:** React 19, JavaScript, Axios
- **Database:** SQLite (local development)
- **Authentication:** Django REST Framework token authentication

## Project structure

- `authentication/` — user registration and login
- `tasks/` — task models, serializers, and API endpoints
- `core/` — Django project configuration
- `frontend/` — React user interface
- `api_test.http` — sample requests for local API testing
- `requirements.txt` — Python environment dependencies

## Run locally

**Requirements:** Python, Node.js and npm.

### Backend

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create a local `.env` file in the repository root:

```dotenv
DJANGO_SECRET_KEY=replace-with-a-new-random-secret-key
```

Then run:

```powershell
python manage.py migrate
python manage.py runserver
```

The API is served locally at `http://127.0.0.1:8000/`.

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm start
```

The React development server opens at `http://localhost:3000/`.

## API endpoints

- `POST /api/auth/register` — register a user
- `POST /api/auth/login` — log in and receive an authentication token
- `/api/tasks/` — task-management endpoints (authentication required)

Use `Authorization: Token <your-token>` for protected API calls.

## Security and development notes

- `.env` and `db.sqlite3` are intentionally excluded from version control.
- The application currently uses `DEBUG = True` and is configured for **local development**, not production deployment.
- The existing `requirements.txt` was captured from a larger Python environment, so it may contain packages unrelated to this project. Using a dedicated virtual environment is recommended.
- The included `api_test.http` uses placeholder tokens; insert your own local test token when running requests.

## Status

Student/portfolio project. Run and verify the frontend and backend locally before deploying publicly.
