# Cut 90 Planner - REST API Specification

All API endpoints return standard JSON responses and operate under `application/json` Content-Type headers. Authenticated endpoints rely on HttpOnly session cookies (`session_id`).

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
* **Auth**: Public
* **Description**: Registers a new user account with Argon2 password hashing.
* **Request Body**:
```json
{
  "username": "user123",
  "password": "Password123!",
  "inviteCode": "OPTIONAL_INVITE_CODE"
}
```
* **Response `201 Created`**:
```json
{
  "message": "ลงทะเบียนสำเร็จ",
  "userId": "usr_abc123"
}
```
* **Error `400 Bad Request`**: `{ "error": { "code": "USER_EXISTS", "message": "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" } }`

---

### `POST /api/auth/login`
* **Auth**: Public
* **Description**: Verifies credentials and sets HttpOnly `session_id` cookie.
* **Request Body**:
```json
{
  "username": "user123",
  "password": "Password123!"
}
```
* **Response `200 OK`**: Set-Cookie header issued.
```json
{
  "message": "เข้าสู่ระบบสำเร็จ",
  "user": {
    "id": "usr_abc123",
    "username": "user123"
  }
}
```

---

### `POST /api/auth/logout`
* **Auth**: Required
* **Description**: Invalidates session in database and clears session cookie.
* **Response `200 OK`**: `{ "message": "ออกจากระบบสำเร็จ" }`

---

### `POST /api/auth/change-password`
* **Auth**: Required
* **Description**: Verifies current password using Argon2 and updates to new password.
* **Request Body**:
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```
* **Response `200 OK`**: `{ "message": "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" }`

---

## 2. Profile & Planning Endpoints

### `GET /api/profile`
* **Auth**: Required
* **Response `200 OK`**:
```json
{
  "profile": {
    "sex": "male",
    "age": 30,
    "heightCm": 175,
    "startWeight": 79.3,
    "goalWeight": 69.5,
    "activity": "moderately",
    "startDate": "2026-10-01",
    "proteinGPerKg": 2.1,
    "fatGPerKg": 0.8,
    "recalDay": null,
    "recalWeight": null
  }
}
```

---

### `PUT /api/profile`
* **Auth**: Required
* **Description**: Upserts or updates user profile settings.
* **Request Body**:
```json
{
  "sex": "male",
  "age": 30,
  "heightCm": 175,
  "startWeight": 79.3,
  "goalWeight": 69.5,
  "activity": "moderately",
  "startDate": "2026-10-01",
  "proteinGPerKg": 2.1,
  "fatGPerKg": 0.8,
  "recalDay": 14,
  "recalWeight": 78.1
}
```
* **Response `200 OK`**: `{ "message": "บันทึกโปรไฟล์เรียบร้อย", "profile": { ... } }`

---

## 3. Daily Logging Endpoints

### `GET /api/logs`
* **Auth**: Required
* **Description**: Retrieves all daily logs for the authenticated user (Days 1 to 90).
* **Response `200 OK`**:
```json
{
  "logs": [
    {
      "day": 1,
      "weightKg": 79.1,
      "proteinG": 165,
      "carbG": 160,
      "fatG": 60,
      "waistCm": 83.5,
      "updatedAt": 1760000000000
    }
  ]
}
```

---

### `PUT /api/logs/:day`
* **Auth**: Required
* **Description**: Upserts daily log for day `1 <= day <= 90`.
* **Request Body**:
```json
{
  "day": 1,
  "weightKg": 79.1,
  "proteinG": 165,
  "carbG": 160,
  "fatG": 60,
  "waistCm": 83.5
}
```
* **Response `200 OK`**: `{ "message": "บันทึกข้อมูลวัน 1 เรียบร้อย", "log": { ... } }`

---

## 4. Data Backup & Account Endpoints

### `GET /api/export`
* **Auth**: Required
* **Description**: Exports full user profile and all 90-day logs in JSON format for offline backup.

---

### `POST /api/import`
* **Auth**: Required
* **Description**: Restores user profile and daily logs from a uploaded JSON backup payload.

---

### `DELETE /api/account`
* **Auth**: Required
* **Description**: Permanently deletes user account, profile, sessions, and daily log records.
