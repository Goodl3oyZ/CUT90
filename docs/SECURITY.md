# Cut 90 Planner - Security & Data Protection Architecture

This document details the security design, cryptographic choices, session handling, threat mitigation, and data isolation controls enforced by Cut 90 Planner.

---

## 1. Authentication & Password Hashing

* **Password Hashing Algorithm**: **Argon2id** via `@node-rs/argon2` (winner of Password Hashing Competition).
* **Salt & Memory Parameters**: Automatic random per-password salt generation with memory cost = 65,536 KB, iterations = 3, parallelism = 4.
* **Plaintext Protections**: Plaintext passwords are never logged, stored, or sent to client responses.

---

## 2. Session Management & Cookie Protections

* **Session Token Generation**: Cryptographically secure 256-bit random tokens (`crypto.randomBytes(32)`).
* **Storage**: Stored in SQLite `sessions` table mapped to `user_id` with `expires_at` timestamp (30-day lifetime).
* **Cookie Attributes**:
  * `HttpOnly`: Prevents client-side JavaScript access (`document.cookie`), mitigating XSS session hijacking.
  * `SameSite=Lax`: Protects against Cross-Site Request Forgery (CSRF) on cross-site form submissions.
  * `Secure`: Enforced in production HTTPS environments.
  * `Path=/`: Applies globally across API routes.

---

## 3. CSRF & Rate Limiting Controls

### CSRF Mitigation
Mutation endpoints (`POST`, `PUT`, `DELETE`) inspect `Origin` and `Host` HTTP headers. Cross-origin requests from untrusted origins are blocked with `403 Forbidden`.

### Rate Limiting
To prevent brute-force login and registration attempts, an in-memory rate limiter protects `/api/auth/*` routes:
* **Threshold**: Maximum 10 failed login attempts per IP address per 15-minute window.
* **Lockout Behavior**: Exceeding the threshold returns `429 Too Many Requests` with a retry delay hint.

---

## 4. Multi-Tenant Data Isolation

All database queries across profiles, daily logs, exports, and accounts strictly filter on `user_id` derived directly from the authenticated session cookie (`session.userId`):

```typescript
// Strict data isolation pattern enforced in code
const userLogs = db.select()
  .from(dailyLogs)
  .where(eq(dailyLogs.userId, session.userId));
```

A user can never query or mutate data belonging to another `user_id`.

---

## 5. What Is Not Covered

* **Hardware key / FIDO2 Auth**: WebAuthn is not implemented; authentication relies on username + Argon2 password.
* **Server-side At-Rest Encryption**: SQLite file relies on OS-level disk encryption (e.g. LUKS on Linux / BitLocker).
