## Backend API Routes

### Authentication

- `POST /auth/login`: Authenticate user and issue JWT (HTTP-only cookies).

### Projects & Versions

- `POST /projects`: Create a new project. Fetches active template and initializes ProjectVersion v1 with empty findings.
- `GET /projects/:id`: Retrieve project details and its current version data.
- `POST /projects/:id/version`: Clone the latest version to start new edits (sets `isLocked: false`).
- `POST /projects/:id/publish`: Mark current version as `isLocked: true` to prevent further edits.

### Findings Management

- `POST /projects/:id/findings`: Add a new finding with auto-assigned `displayId` and `order`.
- `PATCH /projects/:id/findings/:findingId`: Update a specific finding. **Must** include `versionNumber` for conflict detection.
- `DELETE /projects/:id/findings/:findingId`: Remove a finding without renumbering existing `displayIds`.
- `PATCH /projects/:id/findings/reorder`: Update the `order` field for a list of findings.

### Report Generation & Files

- `POST /projects/:id/generate`: Trigger PDF generation. Injects data into HTML, converts to PDF, and uploads to S3.
- `GET /projects/:id/download`: Provide the S3 signed URL for the generated PDF.
- `POST /upload/image`: (Internal helper) Upload images to S3 and return the URL to be stored in findings.
