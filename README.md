
# E-Waste App (React + Tailwind)

This is a ready-to-use React + Tailwind project for an E-Waste app with role-based access.

Important: Signup always creates a `user` role. Only an Admin can promote users to `pickup` or `admin`.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Initialize Tailwind (if not present):
   ```
   npx tailwindcss init -p
   ```

3. Start:
   ```
   npm start
   ```

## Firebase
Replace `src/firebase/firebaseConfig.js` with your Firebase project credentials.

Also update Firestore rules as provided in the repo.

