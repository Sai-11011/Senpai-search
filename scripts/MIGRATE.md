Migration instructions for migrate-firestore-to-auth.js

1) Install dependencies:

   npm install firebase-admin

2) Obtain a service account JSON from Firebase Console (Project Settings -> Service accounts -> Generate new private key).

3) Place the JSON file at `scripts/serviceAccountKey.json` or set the environment variable:

   setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\serviceAccountKey.json"
   (restart terminal after setx on Windows)

4) Run the migration script from the project root:

   node scripts/migrate-firestore-to-auth.js

Notes:
- The script will create Auth users using the plaintext passwords from the `userData` collection.
- Test in a staging copy first. Back up your Firestore data before running.
- After migrating, you should remove plaintext `Password` fields and consider forcing password resets.
