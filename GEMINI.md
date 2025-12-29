# Gemini Project Analysis

This document provides a summary of the project structure, technologies used, and instructions for building and running the project.

## Project Overview

This is a web application with a decoupled frontend and backend.

*   **Backend:** The backend is a [Django](https://www.djangoproject.com/) project located in the `backend/` directory. It uses a SQLite database for data storage. The main Django project is `social_project`, and it contains a single app named `sklh`.

*   **Frontend:** The frontend is a [SvelteKit](https://kit.svelte.dev/) project located in the `src/` directory. It uses [Vite](https://vitejs.dev/) for the build process and [Tailwind CSS](https://tailwindcss.com/) for styling.

## Building and Running

### Backend (Django)

To run the backend server, follow these steps:

1.  Navigate to the `backend/` directory.
2.  Create a virtual environment: `python -m venv .venv`
3.  Activate the virtual environment: `source .venv/bin/activate` (on Linux/macOS) or `.venv\Scripts\activate` (on Windows).
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Run the development server: `python manage.py runserver`

The backend will be available at `http://127.0.0.1:8000`.

### Frontend (SvelteKit)

To run the frontend development server, follow these steps:

1.  Navigate to the `src/` directory.
2.  Install the dependencies: `pnpm install`
3.  Run the development server: `pnpm run dev`

The frontend will be available at `http://localhost:5173`.

## Development Conventions

### Backend

*   The Django project follows the standard Django project structure.
*   The `sklh` app contains the models, views, and other application-specific logic.

### Frontend

*   The SvelteKit project uses TypeScript.
*   The code is formatted with [Prettier](https://prettier.io/) and linted with [ESLint](https://eslint.org/).
*   The project uses [Storybook](https://storybook.js.org/) for UI component development and testing.

### Git

*   The project uses a `.gitignore` file to exclude common temporary files and directories from version control.
*   There is a CI workflow defined in `.github/workflows/ci.yml` that is likely used for continuous integration.
