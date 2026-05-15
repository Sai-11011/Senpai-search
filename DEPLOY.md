Vercel Deployment Checklist for Senpai-search

Before you deploy to Vercel, complete these steps locally and in the Vercel project settings.

1) Remove secrets from repo
- Ensure `.env` and any service account JSON files are listed in `.gitignore`.

2) Add environment variables to Vercel
- In your Vercel project, go to Settings → Environment Variables and add the following (Production scope):

  - `FIREBASE_SERVICE_ACCOUNT` = base64-encoded service account JSON (recommended)
    - To create the value on Windows PowerShell:
      ```powershell
      $json = Get-Content -Raw path\to\serviceAccountKey.json; [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json)) | Out-File -Encoding ASCII svc.b64
      ```
    - On macOS / Linux:
      ```bash
      base64 serviceAccountKey.json > svc.b64
      ```
    - Paste the contents of `svc.b64` into Vercel as the env value.

  - Alternatively, provide these individual vars:
    - `FIREBASE_PROJECT_ID`
    - `FIREBASE_CLIENT_EMAIL`
    - `FIREBASE_PRIVATE_KEY` (ensure newline characters are preserved; replace actual newlines with `\n`)
    - `FIREBASE_DATABASE_URL` (if used)

  - Client Firebase config (optional, used in client-side files):
    - `FIREBASE_API_KEY`
    - `FIREBASE_AUTH_DOMAIN`
    - `FIREBASE_PROJECT_ID`
    - `FIREBASE_STORAGE_BUCKET`
    - `FIREBASE_MESSAGING_SENDER_ID`
    - `FIREBASE_APP_ID`
    - `FIREBASE_MEASUREMENT_ID`

3) Ensure `package.json` has a `start` script
- The project includes a `start` script that runs `node server.js`.

4) Authorized domains & OAuth
- In Firebase Console → Authentication → Settings, add your Vercel domain (e.g. `your-project.vercel.app`) to Authorized domains.
- For Google sign-in, ensure OAuth consent and redirect URIs are configured if required.

5) Deployment
- Install Vercel CLI (optional) and run locally to test:
  ```bash
  npm i -g vercel
  vercel login
  vercel dev
  ```
- Deploy:
  ```bash
  vercel --prod
  ```

6) Post-deploy checks
- Visit the deployed URL and test register, login, Google sign-in, and password reset flows.
- Check Firebase Console for new Auth users.

7) Security
- Rotate any keys accidentally committed.
- Tighten Firestore rules before going to production.

If you'd like, I can also:
- Add a `vercel.json` for custom routing.
- Convert the Express routes to Vercel Serverless Functions for a friendlier serverless deployment.
