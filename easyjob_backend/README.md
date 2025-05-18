# EasyJob Backend

A Django REST API backend for the EasyJob job portal application.

## Features

- User authentication with JWT
- User roles (Job Seeker and Employer)
- Company profiles
- Job categories and skills
- Job vacancy posting and management
- Resume upload and management
- Job applications with status tracking
- Advanced search and filtering
- Admin interface

## Prerequisites

- Python 3.8+
- Virtual environment (recommended)

## Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd easyjob_backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   # OR
   source venv/bin/activate     # On Unix/macOS
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root with the following content:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

## Running the Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/v1/`

## API Endpoints

### Authentication
- `POST /api/v1/token/` - Obtain JWT token
- `POST /api/v1/token/refresh/` - Refresh JWT token

### Users
- `POST /api/v1/users/` - Register new user
- `GET /api/v1/users/` - List users (admin only)
- `GET /api/v1/users/{id}/` - Get user details
- `PUT /api/v1/users/{id}/` - Update user
- `DELETE /api/v1/users/{id}/` - Delete user

### Companies
- `GET /api/v1/companies/` - List companies
- `POST /api/v1/companies/` - Create company
- `GET /api/v1/companies/{id}/` - Get company details
- `PUT /api/v1/companies/{id}/` - Update company
- `DELETE /api/v1/companies/{id}/` - Delete company

### Categories
- `GET /api/v1/categories/` - List categories
- `POST /api/v1/categories/` - Create category (admin only)
- `GET /api/v1/categories/{id}/` - Get category details
- `PUT /api/v1/categories/{id}/` - Update category (admin only)
- `DELETE /api/v1/categories/{id}/` - Delete category (admin only)

### Skills
- `GET /api/v1/skills/` - List skills
- `POST /api/v1/skills/` - Create skill (admin only)
- `GET /api/v1/skills/{id}/` - Get skill details
- `PUT /api/v1/skills/{id}/` - Update skill (admin only)
- `DELETE /api/v1/skills/{id}/` - Delete skill (admin only)

### Vacancies
- `GET /api/v1/vacancies/` - List vacancies
- `POST /api/v1/vacancies/` - Create vacancy (employer only)
- `GET /api/v1/vacancies/{id}/` - Get vacancy details
- `PUT /api/v1/vacancies/{id}/` - Update vacancy (owner only)
- `DELETE /api/v1/vacancies/{id}/` - Delete vacancy (owner only)
- `POST /api/v1/vacancies/{id}/apply/` - Apply for vacancy (job seeker only)

### Resumes
- `GET /api/v1/resumes/` - List user's resumes
- `POST /api/v1/resumes/` - Create resume
- `GET /api/v1/resumes/{id}/` - Get resume details
- `PUT /api/v1/resumes/{id}/` - Update resume
- `DELETE /api/v1/resumes/{id}/` - Delete resume

### Applications
- `GET /api/v1/applications/` - List applications
- `POST /api/v1/applications/` - Create application
- `GET /api/v1/applications/{id}/` - Get application details
- `PUT /api/v1/applications/{id}/` - Update application
- `DELETE /api/v1/applications/{id}/` - Delete application
- `POST /api/v1/applications/{id}/update_status/` - Update application status (employer only)

## Admin Interface

The admin interface is available at `http://localhost:8000/admin/`. Use your superuser credentials to log in. 