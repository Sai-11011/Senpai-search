/*
Migration script: migrate-firestore-to-auth.js

What it does:
- Reads documents from Firestore collection `userData` that contain a `Password` field.
- For each such document, creates a Firebase Auth user with that email and password (using Admin SDK).
- Writes the profile to `userData/{uid}` and removes the old document (or you can keep it).

Usage:
1) Install dependencies in project root: `npm install firebase-admin`
2) Provide service account credentials (download JSON from Firebase Console) and either set
   the environment variable `GOOGLE_APPLICATION_CREDENTIALS` pointing to that JSON, or
   place the file next to this script as `serviceAccountKey.json`.
3) Run: `node scripts/migrate-firestore-to-auth.js`

IMPORTANT:
- Test on a copy of your project or a staging project first.
- After migration you should remove plaintext passwords from your database and rotate any keys if leaked.
*/

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('Service account key not found. Set GOOGLE_APPLICATION_CREDENTIALS or place serviceAccountKey.json in scripts/.');
  process.exit(1);
}

const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
  console.log('Starting migration: reading userData collection...');
  const snapshot = await db.collection('userData').get();
  console.log('Found', snapshot.size, 'documents');
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data || !data.Email) continue;
    if (!data.Password) {
      console.log('Skipping', data.Email, '— no Password field');
      continue;
    }
    try {
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: data.Email.toLowerCase(),
        password: data.Password,
        displayName: data.Name || undefined
      });
      const uid = userRecord.uid;
      // Write profile under uid and remove plaintext password
      await db.collection('userData').doc(uid).set({
        uid,
        Email: data.Email.toLowerCase(),
        Name: data.Name || ''
      }, { merge: true });

      // Optionally delete old doc if doc.id !== uid
      if (doc.id !== uid) {
        await db.collection('userData').doc(doc.id).delete();
      }
      console.log('Migrated', data.Email, '-> uid', uid);
    } catch (err) {
      console.error('Error migrating', data.Email, err.code || err.message || err);
    }
  }
  console.log('Migration complete.');
}

migrate().catch(err => { console.error(err); process.exit(1); });
