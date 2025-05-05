# NEET Genie API Documentation

This document provides detailed information about all the API endpoints available in the NEET Genie backend application. The API is organized into several categories:

- [Authentication](#authentication)
- [Tests](#tests)
- [Questions](#questions)
- [Attempts](#attempts)
- [Responses](#responses)
- [Study Materials](#study-materials)
- [Analytics](#analytics)

All API endpoints are prefixed with `/api`.

## Authentication

### Sign Up

Creates a new user account.

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "name": "Student Name",
    "email": "student@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "User created successfully",
      "token": "jwt_token_here",
      "user": {
        "id": 1,
        "name": "Student Name",
        "email": "student@example.com",
        "role": "student",
        "created_at": "2023-01-01T12:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 409 Conflict - Email already registered
  - **Code**: 400 Bad Request - Missing fields or invalid data

### Login

Authenticates a user and returns a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "token": "jwt_token_here",
      "user": {
        "id": 1,
        "name": "Student Name",
        "email": "student@example.com",
        "role": "student",
        "created_at": "2023-01-01T12:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Invalid email or password
  - **Code**: 400 Bad Request - Missing fields

### Change User Role

Changes a user's role (admin only).

- **URL**: `/auth/change-role`
- **Method**: `POST`
- **Authentication Required**: Yes (Admin only)
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "new_role": "teacher"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "User role updated successfully to teacher",
      "user": {
        "id": 1,
        "name": "Student Name",
        "email": "student@example.com",
        "role": "teacher"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not an admin
  - **Code**: 404 Not Found - User not found
  - **Code**: 400 Bad Request - Invalid role

## Tests

### Get All Tests

Retrieves a list of all available tests.

- **URL**: `/tests`
- **Method**: `GET`
- **Authentication Required**: No
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "tests": [
        {
          "id": 1,
          "title": "Physics Test",
          "description": "Basic physics concepts",
          "total_questions": 20,
          "duration_minutes": 60,
          "created_at": "2023-01-01T12:00:00Z"
        },
        {
          "id": 2,
          "title": "Chemistry Test",
          "description": "Basic chemistry concepts",
          "total_questions": 20,
          "duration_minutes": 60,
          "created_at": "2023-01-01T12:00:00Z"
        }
      ]
    }
    ```

### Create Test

Creates a new test (teacher or admin only).

- **URL**: `/tests`
- **Method**: `POST`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**:
  ```json
  {
    "title": "Biology Test",
    "description": "Basic biology concepts",
    "total_questions": 20,
    "duration_minutes": 60
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Test created successfully",
      "test": {
        "id": 3,
        "title": "Biology Test",
        "description": "Basic biology concepts",
        "total_questions": 20,
        "duration_minutes": 60,
        "created_at": "2023-01-01T12:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 400 Bad Request - Missing fields

### Get Test by ID

Retrieves a specific test by ID.

- **URL**: `/tests/:test_id`
- **Method**: `GET`
- **Authentication Required**: No
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "test": {
        "id": 1,
        "title": "Physics Test",
        "description": "Basic physics concepts",
        "total_questions": 20,
        "duration_minutes": 60,
        "created_at": "2023-01-01T12:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found - Test not found

### Update Test

Updates an existing test (teacher or admin only).

- **URL**: `/tests/:test_id`
- **Method**: `PUT`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**:
  ```json
  {
    "title": "Updated Physics Test",
    "description": "Updated physics concepts",
    "total_questions": 25,
    "duration_minutes": 90
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Test updated successfully",
      "test": {
        "id": 1,
        "title": "Updated Physics Test",
        "description": "Updated physics concepts",
        "total_questions": 25,
        "duration_minutes": 90,
        "created_at": "2023-01-01T12:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 404 Not Found - Test not found

### Delete Test

Deletes a test (teacher or admin only).

- **URL**: `/tests/:test_id`
- **Method**: `DELETE`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Test deleted successfully"
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 404 Not Found - Test not found

## Questions

### Create Question

Creates a new question for a test (teacher or admin only).

- **URL**: `/questions`
- **Method**: `POST`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**:
  ```json
  {
    "test_id": 1,
    "question_title": "What is the chemical symbol for water?",
    "option1": "H2O",
    "option2": "CO2",
    "option3": "NaCl",
    "option4": "O2",
    "right_answer": 1,
    "category": "Chemistry",
    "difficulty_level": "Easy",
    "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Question created successfully",
      "question": {
        "id": 1,
        "test_id": 1,
        "question_title": "What is the chemical symbol for water?",
        "option1": "H2O",
        "option2": "CO2",
        "option3": "NaCl",
        "option4": "O2",
        "right_answer": 1,
        "category": "Chemistry",
        "difficulty_level": "Easy",
        "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 404 Not Found - Test not found
  - **Code**: 400 Bad Request - Missing fields or invalid data

### Create Questions Batch

Creates multiple questions for a test in a single request (teacher or admin only).

- **URL**: `/questions/batch`
- **Method**: `POST`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**:
  ```json
  [
    {
      "test_id": 1,
      "question_title": "What is the chemical symbol for water?",
      "option1": "H2O",
      "option2": "CO2",
      "option3": "NaCl",
      "option4": "O2",
      "right_answer": 1,
      "category": "Chemistry",
      "difficulty_level": "Easy",
      "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
    },
    {
      "test_id": 1,
      "question_title": "Which element has the symbol Fe?",
      "option1": "Silver",
      "option2": "Iron",
      "option3": "Fluorine",
      "option4": "Fermium",
      "right_answer": 2,
      "category": "Chemistry",
      "difficulty_level": "Easy",
      "explanation": "The chemical symbol Fe comes from the Latin word 'ferrum' for iron."
    }
  ]
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Successfully created 2 questions",
      "total_submitted": 2,
      "total_created": 2,
      "errors": null
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 400 Bad Request - Invalid array, missing fields, or invalid data
  - **Code**: 500 Server Error - Database error

### Get Questions

Retrieves questions, optionally filtered by test ID.

- **URL**: `/questions`
- **Method**: `GET`
- **Query Parameters**: `test_id` (optional)
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "questions": [
        {
          "id": 1,
          "test_id": 1,
          "question_title": "What is the chemical symbol for water?",
          "option1": "H2O",
          "option2": "CO2",
          "option3": "NaCl",
          "option4": "O2",
          "category": "Chemistry",
          "difficulty_level": "Easy"
        }
      ]
    }
    ```
- **Security Note**: For test integrity, correct answers (`right_answer`) and explanations are not included in public question endpoints.
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated

### Get Question by ID

Retrieves a specific question by ID.

- **URL**: `/questions/:question_id`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "question": {
        "id": 1,
        "test_id": 1,
        "question_title": "What is the chemical symbol for water?",
        "option1": "H2O",
        "option2": "CO2",
        "option3": "NaCl",
        "option4": "O2",
        "category": "Chemistry",
        "difficulty_level": "Easy"
      }
    }
    ```
- **Security Note**: For test integrity, correct answers (`right_answer`) and explanations are not included in public question endpoints.
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 404 Not Found - Question not found

### Get Questions (Teacher/Admin)

Retrieves questions including correct answers (teacher or admin only).

- **URL**: `/questions/admin`
- **Method**: `GET`
- **Query Parameters**: `test_id` (optional)
- **Authentication Required**: Yes (Teacher or Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "questions": [
        {
          "id": 1,
          "test_id": 1,
          "question_title": "What is the chemical symbol for water?",
          "option1": "H2O",
          "option2": "CO2",
          "option3": "NaCl",
          "option4": "O2",
          "right_answer": 1,
          "category": "Chemistry",
          "difficulty_level": "Easy",
          "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
        }
      ]
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not a teacher or admin

### Get Question by ID (Teacher/Admin)

Retrieves a specific question by ID including correct answer (teacher or admin only).

- **URL**: `/questions/admin/:question_id`
- **Method**: `GET`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "question": {
        "id": 1,
        "test_id": 1,
        "question_title": "What is the chemical symbol for water?",
        "option1": "H2O",
        "option2": "CO2",
        "option3": "NaCl",
        "option4": "O2",
        "right_answer": 1,
        "category": "Chemistry",
        "difficulty_level": "Easy",
        "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 404 Not Found - Question not found

### Update Question

Updates an existing question (teacher or admin only).

- **URL**: `/questions/:question_id`
- **Method**: `PUT`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**:
  ```json
  {
    "question_title": "Updated question title",
    "option1": "Updated option 1",
    "option2": "Updated option 2",
    "option3": "Updated option 3",
    "option4": "Updated option 4",
    "right_answer": 2,
    "category": "Updated Category",
    "difficulty_level": "Medium",
    "explanation": "Updated explanation"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Question updated successfully",
      "question": {
        "id": 1,
        "test_id": 1,
        "question_title": "Updated question title",
        "option1": "Updated option 1",
        "option2": "Updated option 2",
        "option3": "Updated option 3",
        "option4": "Updated option 4",
        "right_answer": 2,
        "category": "Updated Category",
        "difficulty_level": "Medium",
        "explanation": "Updated explanation"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 404 Not Found - Question not found
  - **Code**: 400 Bad Request - Invalid data

### Delete Question

Deletes a question (teacher or admin only).

- **URL**: `/questions/:question_id`
- **Method**: `DELETE`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Question deleted successfully"
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 404 Not Found - Question not found

## Attempts

### Create Attempt

Creates a new test attempt for the authenticated user.

- **URL**: `/attempts`
- **Method**: `POST`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "test_id": 1
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Attempt created successfully",
      "attempt": {
        "id": 1,
        "user_id": 1,
        "test_id": 1,
        "started_at": "2023-01-01T12:00:00Z",
        "submitted_at": null,
        "score": null,
        "correct_answers": null,
        "total_questions": 20
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 404 Not Found - Test not found
  - **Code**: 400 Bad Request - Missing fields

### Submit Attempt

Submits a completed test attempt.

- **URL**: `/attempts/:attempt_id/submit`
- **Method**: `POST`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {}
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Attempt submitted successfully",
      "attempt": {
        "id": 1,
        "user_id": 1,
        "test_id": 1,
        "started_at": "2023-01-01T12:00:00Z",
        "submitted_at": "2023-01-01T13:00:00Z",
        "score": 85,
        "correct_answers": 17,
        "total_questions": 20
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not the attempt owner
  - **Code**: 404 Not Found - Attempt not found
  - **Code**: 400 Bad Request - Attempt already submitted

### Get Attempts

Retrieves attempts, filtered by user ID and/or test ID.

- **URL**: `/attempts`
- **Method**: `GET`
- **Query Parameters**: 
  - `user_id` (optional, admin/teacher only)
  - `test_id` (optional)
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "attempts": [
        {
          "id": 1,
          "user_id": 1,
          "test_id": 1,
          "test_title": "Physics Test",
          "started_at": "2023-01-01T12:00:00Z",
          "submitted_at": "2023-01-01T13:00:00Z",
          "score": 85,
          "correct_answers": 17,
          "total_questions": 20,
          "completed": true
        }
      ]
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated

### Get Attempt by ID

Retrieves a specific attempt by ID.

- **URL**: `/attempts/:attempt_id`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "attempt": {
        "id": 1,
        "user_id": 1,
        "test_id": 1,
        "test": {
          "id": 1,
          "title": "Physics Test"
        },
        "started_at": "2023-01-01T12:00:00Z",
        "submitted_at": "2023-01-01T13:00:00Z",
        "score": 85,
        "correct_answers": 17,
        "total_questions": 20,
        "completed": true,
        "responses": [
          {
            "id": 1,
            "question_id": 1,
            "question_title": "What is the chemical symbol for water?",
            "selected_option": 1,
            "is_correct": true,
            "correct_option": 1,
            "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not the attempt owner or admin/teacher
  - **Code**: 404 Not Found - Attempt not found

### Get User History

Retrieves the authenticated user's test history.

- **URL**: `/user/history`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "history": [
        {
          "attempt_id": 1,
          "test_id": 1,
          "test_title": "Physics Test",
          "started_at": "2023-01-01T12:00:00Z",
          "submitted_at": "2023-01-01T13:00:00Z",
          "score": 85,
          "correct_answers": 17,
          "total_questions": 20,
          "time_spent_minutes": 60
        }
      ],
      "stats": {
        "total_tests_completed": 1,
        "average_score": 85.0,
        "best_score": 85
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated

### Get Comprehensive User History

Retrieves comprehensive history for the authenticated user, including test attempts, recent activity, and study materials.

- **URL**: `/user/history`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "user": {
        "id": 1,
        "name": "Student Name",
        "email": "student@example.com",
        "role": "student",
        "created_at": "2023-01-01T12:00:00Z"
      },
      "test_history": {
        "completed": [
          {
            "attempt_id": 1,
            "test_id": 1,
            "test_title": "Physics Test",
            "started_at": "2023-01-01T12:00:00Z",
            "submitted_at": "2023-01-01T13:00:00Z",
            "score": 85,
            "correct_answers": 17,
            "total_questions": 20,
            "time_spent_minutes": 60
          }
        ],
        "in_progress": [
          {
            "id": 2,
            "user_id": 1,
            "test_id": 2,
            "test_title": "Chemistry Test",
            "started_at": "2023-01-02T12:00:00Z",
            "submitted_at": null,
            "completion_percentage": 45
          }
        ],
        "stats": {
          "total_tests_completed": 1,
          "average_score": 85.0,
          "best_score": 85,
          "total_time_spent_minutes": 60
        }
      },
      "recent_activity": [
        {
          "id": 1,
          "question_id": 1,
          "question_title": "What is the chemical symbol for water?",
          "selected_option": 1,
          "is_correct": true,
          "submitted_at": "2023-01-01T12:30:00Z",
          "attempt_id": 1
        }
      ],
      "study_materials": []
    }
    ```
- **Security Note**: To maintain test integrity, the correct answer values (`correct_option`) are never revealed to students in this endpoint, even for completed tests. Only whether a response was correct (`is_correct`) is shown for submitted attempts.
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 404 Not Found - User not found

### Get User History (Admin/Teacher)

Retrieves comprehensive history for a specific user (admin/teacher only).

- **URL**: `/user/history/admin/:user_id`
- **Method**: `GET`
- **Authentication Required**: Yes (Admin or Teacher only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "user": {
        "id": 1,
        "name": "Student Name",
        "email": "student@example.com",
        "role": "student",
        "created_at": "2023-01-01T12:00:00Z"
      },
      "test_history": {
        "completed": [
          {
            "attempt_id": 1,
            "test_id": 1,
            "test_title": "Physics Test",
            "started_at": "2023-01-01T12:00:00Z",
            "submitted_at": "2023-01-01T13:00:00Z",
            "score": 85,
            "correct_answers": 17,
            "total_questions": 20,
            "time_spent_minutes": 60
          }
        ],
        "in_progress": [
          {
            "id": 2,
            "user_id": 1,
            "test_id": 2,
            "test_title": "Chemistry Test",
            "started_at": "2023-01-02T12:00:00Z",
            "submitted_at": null,
            "completion_percentage": 45
          }
        ],
        "stats": {
          "total_tests_completed": 1,
          "average_score": 85.0,
          "best_score": 85,
          "total_time_spent_minutes": 60
        }
      },
      "responses": [
        {
          "id": 1,
          "question_id": 1,
          "question_title": "What is the chemical symbol for water?",
          "selected_option": 1,
          "is_correct": true,
          "submitted_at": "2023-01-01T12:30:00Z",
          "correct_option": 1,
          "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom.",
          "attempt_id": 1
        }
      ]
    }
    ```
- **Security Note**: For admin and teacher users, correct answer information and explanations are provided, but only for responses from submitted attempts to enable proper assessment and monitoring.
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not an admin or teacher
  - **Code**: 404 Not Found - Target user not found

### Get Attempt Questions

Retrieves questions for a specific attempt.

- **URL**: `/attempts/:attempt_id/questions`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "questions": [
        {
          "id": 1,
          "question_title": "What is the chemical symbol for water?",
          "options": [
            "H2O",
            "CO2",
            "NaCl",
            "O2"
          ],
          "category": "Chemistry",
          "difficulty_level": "Easy",
          "is_answered": true,
          "user_response": {
            "selected_option": 1,
            "is_correct": null
          }
        }
      ],
      "progress": {
        "answered_questions": 1,
        "total_questions": 20,
        "completion_percentage": 5,
        "is_submitted": false,
        "score": null
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not the attempt owner
  - **Code**: 404 Not Found - Attempt not found

### Answer Questions

Submits answers to questions in an attempt.

- **URL**: `/attempts/:attempt_id/answer`
- **Method**: `POST`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "question_id": 1,
        "selected_option": 1
      },
      {
        "question_id": 2,
        "selected_option": 3
      }
    ]
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Successfully processed 2 answers",
      "results": [
        {
          "question_id": 1,
          "selected_option": 1
        },
        {
          "question_id": 2,
          "selected_option": 3
        }
      ],
      "progress": {
        "questions_answered": 2,
        "total_questions": 20,
        "completion_percentage": 10
      }
    }
    ```
- **Security Note**: For test integrity, correctness of answers is never revealed during an active test attempt. Correctness information is only available after the test is submitted.
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not the attempt owner
  - **Code**: 404 Not Found - Attempt not found
  - **Code**: 400 Bad Request - Attempt already submitted or invalid answers

## Responses

### Create Response

Creates a new response for a single question in an attempt.

- **URL**: `/responses`
- **Method**: `POST`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "attempt_id": 1,
    "question_id": 1,
    "selected_option": 1
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Response submitted successfully",
      "response": {
        "id": 1,
        "attempt_id": 1,
        "question_id": 1,
        "selected_option": 1,
        "is_correct": true,
        "submitted_at": "2023-01-01T12:30:00Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not the attempt owner
  - **Code**: 404 Not Found - Attempt or question not found
  - **Code**: 400 Bad Request - Response already exists, attempt already submitted, or invalid data

### Get Attempt Responses

Retrieves responses for a specific attempt.

- **URL**: `/attempts/:attempt_id/responses`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response** (for submitted attempt):
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "responses": [
        {
          "id": 1,
          "question_id": 1,
          "question_title": "What is the chemical symbol for water?",
          "selected_option": 1,
          "is_correct": true,
          "submitted_at": "2023-01-01T12:30:00Z",
          "correct_option": 1,
          "explanation": "Water is H2O - two hydrogen atoms bonded to one oxygen atom."
        }
      ],
      "summary": {
        "total_responses": 1,
        "correct_responses": 1,
        "total_questions": 20,
        "completion_percentage": 5
      }
    }
    ```
  - **Content** (for in-progress attempt):
    ```json
    {
      "responses": [
        {
          "id": 1,
          "question_id": 1,
          "question_title": "What is the chemical symbol for water?",
          "selected_option": 1,
          "is_correct": null,
          "submitted_at": "2023-01-01T12:30:00Z"
        }
      ],
      "summary": {
        "total_responses": 1,
        "correct_responses": null,
        "total_questions": 20,
        "completion_percentage": 5
      }
    }
    ```
- **Security Note**: For test integrity, correctness of answers and explanations are only revealed after the test is submitted.
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not the attempt owner
  - **Code**: 404 Not Found - Attempt not found

## Study Materials

### Get All Study Materials

Retrieves a list of all study materials with optional filtering.

- **URL**: `/study-materials`
- **Method**: `GET`
- **Query Parameters**: 
  - `subject` (optional): Filter by subject
  - `material_type` (optional): Filter by material type
  - `uploader_id` (optional): Filter by uploader
  - `chapter` (optional): Filter by chapter
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "study_materials": [
        {
          "id": 1,
          "title": "NEET Biology - Cell Structure",
          "description": "Comprehensive video on cell structure for NEET exam preparation",
          "material_type": "video",
          "content_url": "https://www.youtube.com/watch?v=example123",
          "text_content": null,
          "subject": "Biology",
          "chapter": "Cell Structure",
          "uploader": {
            "id": 1,
            "name": "Teacher Name",
            "email": "teacher@example.com",
            "role": "teacher"
          },
          "created_at": "2023-01-01T12:00:00Z",
          "updated_at": "2023-01-01T12:00:00Z",
          "thumbnail_url": "https://img.youtube.com/vi/example123/hqdefault.jpg"
        }
      ],
      "count": 1
    }
    ```

### Get Study Material by ID

Retrieves a specific study material by ID.

- **URL**: `/study-materials/:material_id`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "study_material": {
        "id": 1,
        "title": "NEET Biology - Cell Structure",
        "description": "Comprehensive video on cell structure for NEET exam preparation",
        "material_type": "video",
        "content_url": "https://www.youtube.com/watch?v=example123",
        "text_content": null,
        "subject": "Biology",
        "chapter": "Cell Structure",
        "uploader": {
          "id": 1,
          "name": "Teacher Name",
          "email": "teacher@example.com",
          "role": "teacher"
        },
        "created_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:00:00Z",
        "thumbnail_url": "https://img.youtube.com/vi/example123/hqdefault.jpg"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found - Study material not found

### Create Study Material

Creates a new study material (teacher/admin only).

- **URL**: `/study-materials`
- **Method**: `POST`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**:
  ```json
  {
    "title": "NEET Biology - Cell Structure",
    "description": "Comprehensive video on cell structure for NEET exam preparation",
    "material_type": "video",
    "content_url": "https://www.youtube.com/watch?v=example123",
    "subject": "Biology",
    "chapter": "Cell Structure"
  }
  ```
  or
  ```json
  {
    "title": "Chemical Bonding Quick Notes",
    "description": "Concise notes on chemical bonding",
    "material_type": "note",
    "text_content": "# Chemical Bonding\n\n## Ionic Bonds\nIonic bonds form when electrons are transferred from one atom to another...",
    "subject": "Chemistry",
    "chapter": "Chemical Bonding"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "message": "Study material created successfully",
      "study_material": {
        "id": 1,
        "title": "NEET Biology - Cell Structure",
        "description": "Comprehensive video on cell structure for NEET exam preparation",
        "material_type": "video",
        "content_url": "https://www.youtube.com/watch?v=example123",
        "text_content": null,
        "subject": "Biology",
        "chapter": "Cell Structure",
        "uploader": {
          "id": 1,
          "name": "Teacher Name",
          "email": "teacher@example.com",
          "role": "teacher"
        },
        "created_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:00:00Z",
        "thumbnail_url": "https://img.youtube.com/vi/example123/hqdefault.jpg"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not a teacher or admin
  - **Code**: 400 Bad Request - Missing required fields or invalid material type

### Update Study Material

Updates an existing study material (teacher/admin only).

- **URL**: `/study-materials/:material_id`
- **Method**: `PUT`
- **Authentication Required**: Yes (Teacher or Admin only, must be the uploader or an admin)
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "subject": "Updated Subject",
    "chapter": "Updated Chapter"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Study material updated successfully",
      "study_material": {
        "id": 1,
        "title": "Updated Title",
        "description": "Updated description",
        "material_type": "video",
        "content_url": "https://www.youtube.com/watch?v=example123",
        "text_content": null,
        "subject": "Updated Subject",
        "chapter": "Updated Chapter",
        "uploader": {
          "id": 1,
          "name": "Teacher Name",
          "email": "teacher@example.com",
          "role": "teacher"
        },
        "created_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:30:00Z",
        "thumbnail_url": "https://img.youtube.com/vi/example123/hqdefault.jpg"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not authorized to update this study material
  - **Code**: 404 Not Found - Study material not found
  - **Code**: 400 Bad Request - Invalid material type

### Delete Study Material

Deletes a study material (teacher/admin only).

- **URL**: `/study-materials/:material_id`
- **Method**: `DELETE`
- **Authentication Required**: Yes (Teacher or Admin only, must be the uploader or an admin)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Study material deleted successfully"
    }
    ```
- **Error Responses**:
  - **Code**: 403 Forbidden - Not authorized to delete this study material
  - **Code**: 404 Not Found - Study material not found

### Get Material Types

Retrieves a list of valid material types.

- **URL**: `/study-materials/types`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "material_types": ["note", "video", "pdf", "summary", "tip"]
    }
    ```

### Get Subjects

Retrieves a list of subjects with study materials.

- **URL**: `/study-materials/subjects`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "subjects": ["Biology", "Chemistry", "Physics"]
    }
    ```

### Get Study Material Content

Retrieves the full content of a specific study material based on its type (text, video, or PDF).

- **URL**: `/api/study-materials/:material_id/content`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response for Text-Based Materials** (notes, tips, summaries):
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "id": 1,
      "title": "NEET Biology - Cell Structure",
      "material_type": "note",
      "subject": "Biology",
      "chapter": "Cell Structure",
      "content": "# Cell Structure\n\nThe cell is the basic structural and functional unit of life...",
      "created_at": "2023-01-01T12:00:00Z",
      "updated_at": "2023-01-01T12:00:00Z"
    }
    ```
- **Success Response for Video Materials**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "id": 2,
      "title": "Understanding Chemical Bonding",
      "material_type": "video",
      "subject": "Chemistry",
      "chapter": "Chemical Bonding",
      "video_url": "https://www.youtube.com/watch?v=example123",
      "thumbnail_url": "https://img.youtube.com/vi/example123/hqdefault.jpg",
      "created_at": "2023-01-01T12:00:00Z",
      "updated_at": "2023-01-01T12:00:00Z"
    }
    ```
- **Success Response for PDF Materials**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "id": 3,
      "title": "Physics Formula Sheet",
      "material_type": "pdf",
      "subject": "Physics",
      "chapter": "Formula Reference",
      "pdf_url": "https://example.com/physics-formulas.pdf",
      "download_url": "https://neetgenie.com/api/study-materials/3/download",
      "created_at": "2023-01-01T12:00:00Z",
      "updated_at": "2023-01-01T12:00:00Z"
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found - Study material not found or has no content
  - **Code**: 400 Bad Request - Unsupported material type
  - **Code**: 401 Unauthorized - Not authenticated

### Create/Update Study Material Content

Creates or updates the content of a specific study material (teacher/admin only).

- **URL**: `/api/study-materials/:material_id/content`
- **Method**: `POST`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body for Text-Based Materials**:
  ```json
  {
    "content": "# Cell Structure\n\nThe cell is the basic structural and functional unit of life..."
  }
  ```
- **Request Body for Video/PDF Materials**:
  ```json
  {
    "content_url": "https://example.com/video-or-pdf-url"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Study material content updated successfully",
      "material_id": 1
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found - Study material not found
  - **Code**: 403 Forbidden - Not authorized to update this study material
  - **Code**: 400 Bad Request - Missing content or unsupported material type
  - **Code**: 401 Unauthorized - Not authenticated

### Update Study Material Content

Updates the content of a specific study material (teacher/admin only).

- **URL**: `/api/study-materials/:material_id/content`
- **Method**: `PUT`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Request Body**: Same as POST method
- **Success Response**: Same as POST method
- **Error Responses**: Same as POST method

### Delete Study Material Content

Deletes the content of a specific study material (teacher/admin only).

- **URL**: `/api/study-materials/:material_id/content`
- **Method**: `DELETE`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Study material content deleted successfully",
      "material_id": 1
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found - Study material not found
  - **Code**: 403 Forbidden - Not authorized to delete content from this study material
  - **Code**: 400 Bad Request - Unsupported material type
  - **Code**: 401 Unauthorized - Not authenticated

### Upload Study Material File

Uploads a file for a study material (teacher/admin only).

- **URL**: `/api/study-materials/:material_id/upload`
- **Method**: `POST`
- **Authentication Required**: Yes (Teacher or Admin only)
- **Content-Type**: `multipart/form-data`
- **Request Parameters**:
  - `file`: The PDF file to upload
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "File uploaded successfully",
      "material_id": 1,
      "filename": "physics-formulas.pdf"
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found - Study material not found
  - **Code**: 403 Forbidden - Not authorized to upload files to this study material
  - **Code**: 400 Bad Request - No file selected, file type not supported, etc.
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 500 Server Error - Error uploading file

### Download Study Material

Downloads a study material file (primarily for PDFs).

- **URL**: `/api/study-materials/:material_id/download`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Binary file data with appropriate headers for download
- **Error Responses**:
  - **Code**: 404 Not Found - Study material or file not found
  - **Code**: 400 Bad Request - Download not supported for the material type
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 502 Bad Gateway - Failed to fetch file from remote server
  - **Code**: 500 Server Error - Error downloading file

## Analytics

### Get Admin Analytics

Retrieves comprehensive analytics data for the admin dashboard.

- **URL**: `/api/admin/analytics`
- **Method**: `GET`
- **Authentication Required**: Yes (Admin only)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "users": {
        "total": 120,
        "new_last_week": 15,
        "new_last_month": 45,
        "by_role": {
          "student": 100,
          "teacher": 15,
          "admin": 5
        }
      },
      "tests": {
        "total": 25,
        "by_category": {
          "Physics": 8,
          "Chemistry": 10,
          "Biology": 7
        },
        "most_popular": [
          {"id": 12, "title": "NEET Physics Mock", "attempts": 85},
          {"id": 7, "title": "Chemistry Fundamentals", "attempts": 72}
        ]
      },
      "questions": {
        "total": 1200,
        "by_difficulty": {
          "Easy": 400,
          "Medium": 500,
          "Hard": 300
        },
        "by_category": {
          "Physics": 400,
          "Chemistry": 400,
          "Biology": 400
        },
        "hardest": [
          {"id": 127, "title": "Quantum Mechanics Problem", "category": "Physics", "incorrect_rate": 82.5}
        ]
      },
      "attempts": {
        "total": 1500,
        "completed": 1350,
        "last_week": 120,
        "last_month": 450,
        "avg_score": 68.7,
        "score_distribution": {
          "0-40": 150,
          "41-60": 400,
          "61-80": 600,
          "81-100": 200
        }
      },
      "study_materials": {
        "total": 75,
        "by_type": {
          "note": 30,
          "video": 25,
          "pdf": 20
        },
        "by_subject": {
          "Physics": 25,
          "Chemistry": 25,
          "Biology": 25
        }
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 403 Forbidden - Not an admin
  - **Code**: 500 Server Error - Error generating analytics

### Get User Analytics

Retrieves personalized analytics data for the authenticated user.

- **URL**: `/api/user/analytics`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "performance": {
        "weekly_trends": [
          { "date": "Week 1", "physics": 65, "chemistry": 58, "biology": 70 },
          { "date": "Week 2", "physics": 68, "chemistry": 62, "biology": 72 }
        ],
        "subject_scores": [
          { "subject": "Physics", "score": 78, "fullMark": 100 },
          { "subject": "Chemistry", "score": 80, "fullMark": 100 },
          { "subject": "Biology", "score": 85, "fullMark": 100 }
        ],
        "time_distribution": [
          { "name": "Physics", "value": 35, "color": "#2563eb" },
          { "name": "Chemistry", "value": 30, "color": "#10b981" },
          { "name": "Biology", "value": 35, "color": "#f59e0b" }
        ],
        "weak_areas": [
          { "topic": "Electromagnetism", "score": 62, "subject": "Physics" },
          { "topic": "Organic Chemistry", "score": 68, "subject": "Chemistry" }
        ]
      },
      "overall_stats": {
        "progress_percentage": 78,
        "progress_change": 12,
        "tests_completed": 18,
        "total_tests": 24,
        "study_time_hours": 42.5,
        "weak_areas_count": 3
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 404 Not Found - User not found
  - **Code**: 500 Server Error - Error generating analytics

### Get Detailed User Analytics

Retrieves comprehensive, detailed analytics data for the authenticated user, including subject breakdowns, time usage metrics, and personalized recommendations.

- **URL**: `/api/user/analytics/detailed`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "overview": {
        "overall_score": 75,
        "tests_completed": 15,
        "total_study_time": 32,
        "recent_improvement": 8,
        "strengths": ["Photosynthesis", "Chemical Equations", "Classical Mechanics"],
        "weaknesses": ["Organic Chemistry", "Electromagnetism", "Human Physiology"]
      },
      "performance_trends": {
        "monthly_data": [
          {
            "month": "Jan",
            "physics": 65,
            "chemistry": 70,
            "biology": 80,
            "overall": 72
          },
          {
            "month": "Feb",
            "physics": 68,
            "chemistry": 72,
            "biology": 82,
            "overall": 74
          }
        ],
        "by_difficulty": [
          {
            "difficulty": "Easy",
            "score": 85,
            "count": 120
          },
          {
            "difficulty": "Medium",
            "score": 75,
            "count": 180
          },
          {
            "difficulty": "Hard",
            "score": 62,
            "count": 90
          }
        ]
      },
      "subject_analysis": {
        "radar_data": [
          {
            "subject": "Physics",
            "score": 68,
            "average": 65
          },
          {
            "subject": "Chemistry",
            "score": 72,
            "average": 68
          },
          {
            "subject": "Biology",
            "score": 82,
            "average": 70
          }
        ],
        "sub_topics": {
          "physics": [
            {
              "name": "Mechanics",
              "mastery": 75,
              "questions_attempted": 45,
              "time_spent": 3.5
            },
            {
              "name": "Electromagnetism",
              "mastery": 60,
              "questions_attempted": 38,
              "time_spent": 4.2
            }
          ],
          "chemistry": [
            {
              "name": "Organic Chemistry",
              "mastery": 55,
              "questions_attempted": 40,
              "time_spent": 5.0
            }
          ]
        }
      },
      "time_metrics": {
        "average_time_per_question": {
          "physics": 45,
          "chemistry": 50,
          "biology": 40
        },
        "time_distribution": [
          {
            "activity": "Physics",
            "hours": 10.5,
            "percentage": 0.33,
            "color": "#3b82f6"
          },
          {
            "activity": "Chemistry",
            "hours": 12.2,
            "percentage": 0.38,
            "color": "#10b981"
          },
          {
            "activity": "Biology",
            "hours": 9.3,
            "percentage": 0.29,
            "color": "#f59e0b"
          }
        ],
        "efficiency_score": 72
      },
      "weak_areas": [
        {
          "topic": "Organic Chemistry",
          "subtopic": "Reaction Mechanisms",
          "score": 45,
          "recommended_resources": [
            {
              "title": "Organic Chemistry Reaction Mechanisms",
              "type": "video",
              "link": "/study-materials/12"
            },
            {
              "title": "Practice Questions - Reaction Mechanisms",
              "type": "quiz",
              "link": "/mock-tests/5"
            }
          ]
        }
      ],
      "progress": {
        "weekly_progress": [
          {
            "week": "Week 1",
            "progress": 65,
            "target": 70
          },
          {
            "week": "Week 2",
            "progress": 68,
            "target": 72
          }
        ],
        "milestones": [
          {
            "title": "Complete 10 Mock Tests",
            "completed": true,
            "date": "2025-03-15"
          },
          {
            "title": "Score 80% in Physics",
            "completed": false
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **Code**: 401 Unauthorized - Not authenticated
  - **Code**: 404 Not Found - User not found
  - **Code**: 500 Server Error - Error generating analytics

## Authentication

All authenticated endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

The token is obtained from the login or signup endpoints.

## Error Handling

All API endpoints follow a consistent error format:

```json
{
  "error": "Error message explaining what went wrong"
}
```

Common HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (missing or invalid parameters)
- 401: Unauthorized (missing or invalid authentication)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource does not exist)
- 409: Conflict (resource already exists)
- 500: Server Error

## User Roles

The system has three types of users:

1. **Student**: Regular user who can take tests
2. **Teacher**: Can view student attempts and results
3. **Admin**: Full access to create/edit tests and questions, manage users

## Study Plan API

### Generate Study Plan

Generates a customized study plan for the user based on their exam preparation needs using the Gemini AI and saves it to the database.

- URL: `/api/study-plan/generate`
- Method: `POST`
- Authentication: Required (JWT Token)
- Request Body:

```json
{
  "exam_name": "NEET",
  "days_left": 60,
  "study_hours_per_day": 6,
  "weak_topics": ["Organic Chemistry", "Thermodynamics", "Human Physiology"],
  "strong_topics": ["Mechanics", "Cell Biology", "Inorganic Chemistry"]
}
```

- Required fields:
  - `exam_name`: Name of the exam the student is preparing for
  - `days_left`: Number of days left until the exam
  - `study_hours_per_day`: Hours available for studying each day

- Optional fields:
  - `weak_topics`: List of topics the student struggles with (needs more focus)
  - `strong_topics`: List of topics the student is confident in (needs less focus)

- Success Response:
  - Code: `200 OK`
  - Content:

```json
{
  "study_plan": {
    "overview": {
      "exam_name": "NEET",
      "duration_days": 60,
      "study_hours_per_day": 6,
      "weak_topics": ["Organic Chemistry", "Thermodynamics", "Human Physiology"],
      "strong_topics": ["Mechanics", "Cell Biology", "Inorganic Chemistry"]
    },
    "key_principles": [
      "Prioritize weak areas but don't neglect strong ones.",
      "Regular revision is crucial for retention.",
      "Practice questions are essential for understanding application."
    ],
    "resources": {
      "essential": ["NCERT Textbooks (Physics, Chemistry, Biology)"],
      "reference": ["HC Verma (Physics)", "OP Tandon (Organic Chemistry)"],
      "practice": ["DC Pandey (Physics)", "MS Chauhan (Organic Chemistry)"],
      "online": ["YouTube Channels (e.g., Physics Wallah, Vedantu NEET)"]
    },
    "daily_schedule": {
      "morning": {
        "duration": "2 hours",
        "focus": "Theory review and concept building"
      },
      "midday": {
        "duration": "2 hours",
        "focus": "Problem-solving and application of concepts"
      },
      "afternoon": {
        "duration": "2 hours",
        "focus": "Revision, practice questions, and mock tests"
      }
    },
    "weekly_plans": [
      {
        "week_number": 1,
        "title": "Organic Chemistry Foundation",
        "goal": "Understanding basic concepts of organic chemistry",
        "days": [
          {
            "day_number": 1,
            "subject": "Chemistry",
            "topic": "Nomenclature and IUPAC naming",
            "activities": "Read NCERT, OP Tandon. Practice 50+ questions from MS Chauhan.",
            "resources": "NCERT, OP Tandon, MS Chauhan"
          }
        ]
      }
    ],
    "important_notes": [
      "Stick to the schedule as much as possible.",
      "Take short breaks every hour to avoid burnout."
    ],
    "final_advice": "Stay consistent, focused, and confident."
  },
  "success": true,
  "plan_id": 1
}
```

- Error Responses:
  - Code: `400 Bad Request`
    - Content: `{"error": "Missing required fields: exam_name, days_left, study_hours_per_day"}`
  - Code: `500 Internal Server Error`
    - Content: `{"error": "Error generating study plan: [error details]"}`
    - Content: `{"error": "Error parsing study plan JSON: [error details]"}`

- Notes:
  - The generated plan is returned as a structured JSON object for easy frontend rendering
  - The plan includes an overview, key principles, resources, daily schedule, weekly plans, important notes, and final advice
  - Each week in the plan has daily breakdowns with specific topics and activities
  - More time is allocated to weak topics
  - The plan is saved to the database and a `plan_id` is returned in the response
  - Requires a valid Gemini API key set in the environment variables

### Get User Study Plans

Retrieves all study plans created by the current user.

- URL: `/api/study-plan/plans`
- Method: `GET`
- Authentication: Required (JWT Token)
- Success Response:
  - Code: `200 OK`
  - Content:

```json
{
  "success": true,
  "plans": [
    {
      "id": 1,
      "user_id": 3,
      "exam_name": "NEET",
      "days_left": 60,
      "study_hours_per_day": 6,
      "weak_topics": ["Organic Chemistry", "Thermodynamics", "Human Physiology"],
      "strong_topics": ["Mechanics", "Cell Biology", "Inorganic Chemistry"],
      "plan_data": { /* Full study plan object */ },
      "created_at": "2023-05-15T14:30:00Z"
    },
    {
      "id": 2,
      "user_id": 3,
      "exam_name": "NEET",
      "days_left": 45,
      "study_hours_per_day": 8,
      "weak_topics": ["Organic Chemistry", "Thermodynamics"],
      "strong_topics": ["Mechanics", "Cell Biology"],
      "plan_data": { /* Full study plan object */ },
      "created_at": "2023-05-20T10:15:00Z"
    }
  ],
  "count": 2
}
```

- Error Response:
  - Code: `401 Unauthorized`
    - Content: `{"error": "Missing Authorization Header"}`

### Get Study Plan by ID

Retrieves a specific study plan by its ID.

- URL: `/api/study-plan/plans/:plan_id`
- Method: `GET`
- Authentication: Required (JWT Token)
- URL Parameters:
  - `plan_id`: ID of the study plan to retrieve
- Success Response:
  - Code: `200 OK`
  - Content:

```json
{
  "success": true,
  "plan": {
    "id": 1,
    "user_id": 3,
    "exam_name": "NEET",
    "days_left": 60,
    "study_hours_per_day": 6,
    "weak_topics": ["Organic Chemistry", "Thermodynamics", "Human Physiology"],
    "strong_topics": ["Mechanics", "Cell Biology", "Inorganic Chemistry"],
    "plan_data": { /* Full study plan object */ },
    "created_at": "2023-05-15T14:30:00Z"
  }
}
```

- Error Responses:
  - Code: `404 Not Found`
    - Content: `{"error": "Study plan not found or unauthorized"}`
  - Code: `401 Unauthorized`
    - Content: `{"error": "Missing Authorization Header"}`

### Delete Study Plan

Deletes a specific study plan.

- URL: `/api/study-plan/plans/:plan_id`
- Method: `DELETE`
- Authentication: Required (JWT Token)
- URL Parameters:
  - `plan_id`: ID of the study plan to delete
- Success Response:
  - Code: `200 OK`
  - Content:

```json
{
  "success": true,
  "message": "Study plan deleted successfully"
}
```

- Error Responses:
  - Code: `404 Not Found`
    - Content: `{"error": "Study plan not found or unauthorized"}`
  - Code: `401 Unauthorized`
    - Content: `{"error": "Missing Authorization Header"}`

### Ask Assistant

Sends a user's question or doubt to the AI assistant and returns a helpful response tailored for NEET preparation.

- URL: `/api/study-plan/ask-assistant`
- Method: `POST`
- Authentication: Required (JWT Token)
- Request Body:

```json
{
  "query": "Can you explain the difference between mitosis and meiosis?",
  "subject": "Biology"
}
```

- Required fields:
  - `query`: The user's question or doubt to be answered

- Optional fields:
  - `subject`: The subject context for the question (e.g., "Physics", "Chemistry", "Biology")

- Success Response:
  - Code: `200 OK`
  - Content:

```json
{
  "success": true,
  "response": "Mitosis and meiosis are both types of cell division, but they serve different purposes...[complete response text]"
}
```

- Error Responses:
  - Code: `400 Bad Request`
    - Content: `{"error": "Missing required field: query"}`
  - Code: `500 Internal Server Error`
    - Content: `{"error": "Error generating response: [error details]"}`

- Notes:
  - The AI assistant is configured to answer as an expert in NEET preparation
  - Responses include accurate, factual information relevant to the NEET syllabus
  - For numerical problems, step-by-step solutions are provided
  - Conceptual explanations include underlying principles and examples
  - Requires a valid Gemini API key set in the environment variables 