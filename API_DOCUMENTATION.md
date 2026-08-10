# CampusPulse API Specifications (OpenAPI / REST Docs)

> Technical API Contract for Backend Lead & Frontend Lead collaboration.

---

## Base URL
```
HTTP / HTTPS: /api
```

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates user email and password. Returns JWT token and user profile object.
- **Request Body**:
  ```json
  {
    "email": "aarav.sharma@campus.edu",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "user-student-1",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu",
      "role": "STUDENT",
      "department": "Computer Science & Engineering"
    },
    "token": "jwt-token-user-student-1-1770728400"
  }
  ```

---

### `POST /api/auth/register`
Creates new pending user account and issues verification OTP code.
- **Request Body**:
  ```json
  {
    "name": "Rohan Verma",
    "email": "rohan@campus.edu",
    "password": "password123",
    "role": "STUDENT",
    "department": "Computer Science & Engineering"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Registration initiated. Verification OTP sent to email.",
    "user": { "id": "user-1770728400", "email": "rohan@campus.edu" },
    "otp": "489123"
  }
  ```

---

## 2. Attendance Endpoints

### `GET /api/attendance?studentId={id}`
Returns list of attendance sessions and attendance records.

### `POST /api/attendance`
Dual action endpoint for creating QR sessions (Faculty) and scanning QR tokens (Students).

- **Create Session (Faculty)**:
  ```json
  {
    "action": "CREATE_SESSION",
    "subject": "Advanced Database Management",
    "subjectCode": "CS601",
    "facultyId": "user-faculty-1",
    "facultyName": "Dr. Rajesh Kulkarni"
  }
  ```
- **Mark Attendance (Student)**:
  ```json
  {
    "action": "MARK_ATTENDANCE",
    "qrToken": "QR-CS601-20260810-8891",
    "studentId": "user-student-1",
    "studentName": "Aarav Sharma",
    "rollNumber": "CS2024-042"
  }
  ```

---

## 3. Assignment Endpoints

### `GET /api/assignments?assignmentId={id}&studentId={id}`
Retrieves published assignments and submitted solutions.

### `POST /api/assignments`
Actions: `CREATE_ASSIGNMENT`, `SUBMIT_SOLUTION`, `GRADE_SUBMISSION`.

- **Submit Solution**:
  ```json
  {
    "action": "SUBMIT_SOLUTION",
    "assignmentId": "assign-1",
    "assignmentTitle": "Mini Distributed Storage Engine",
    "studentId": "user-student-1",
    "studentName": "Aarav Sharma",
    "rollNumber": "CS2024-042",
    "solutionText": "Implemented raft consensus",
    "gitHubUrl": "https://github.com/aaravsharma/kv-store-raft"
  }
  ```

---

## 4. Event & Ticket Pass Endpoints

### `GET /api/events?studentId={id}`
Returns active campus events and ticket pass registrations.

### `POST /api/events`
Actions: `CREATE_EVENT`, `REGISTER_EVENT`.

---

## 5. Placement Endpoints

### `GET /api/placements?studentId={id}`
Retrieves job notices and student applications.

### `POST /api/placements`
Actions: `CREATE_PLACEMENT`, `APPLY`.

---

## 6. Admin Analytics & Audit Logs

### `GET /api/admin`
Returns aggregated system metrics (total users, student count, faculty count, average attendance rate, placement rate) and security audit log history.
