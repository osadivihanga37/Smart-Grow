# Smart Grow

A multilingual (English / Sinhala / Tamil) mobile application providing Dambulla-region Big Onion farmers in Sri Lanka with data-driven irrigation and disease-risk guidance, grounded in peer-reviewed agronomic research.

Built as a final-year individual project: React Native (Expo) frontend, Django REST Framework backend, Firebase Auth + Firestore for identity and farmer profile data.

## Features

- **Irrigation recommendations** — daily moisture-deficit calculation from live weather data, based on FCRDI research (Sumanaratne, 1999).
- **Disease-risk forecasting** — temperature/humidity/rainfall-based risk scoring for four Big Onion diseases: Black Mold, Anthracnose-Twister, Purple Blotch, Basal Rot.
- **Crops advisory** — yield and practice benchmarks from the DCS Big Onion Survey 2021.
- **Full English / Sinhala / Tamil localisation**, including icon-supported navigation for low-literacy users.
- **Firebase Auth + Firestore** — email/password authentication, farmer profile storage, silent ID-token refresh.
- **Dambulla service-area restriction** — a 30km hard-blocked service radius, since recommendation thresholds are calibrated to local conditions.
- **Location tracking, notifications** (validation errors + irrigation-day reminders), and a Settings screen for profile/language/notification/location management.

## Tech Stack

**Backend:** Django 6.0, Django REST Framework, firebase-admin (Auth verification + Firestore), pandas/numpy, SQLite (admin/session tables only).

**Frontend:** React Native 0.76 (Expo SDK 52), React Navigation, expo-location, expo-notifications, AsyncStorage, axios.

**Services:** Firebase Auth + Firestore (Spark/free tier), a live weather API for temperature/humidity/rainfall.

## Project Structure

```
Smart Grow/
├── Backend/                 Django project
│   ├── smartgrow/           settings, Firebase config, translations
│   ├── users/               Firebase-backed auth, profile endpoints
│   ├── irrigation/          recommendation engine + models
│   ├── disease/             forecasting engine + models
│   └── crops/                advisory data
└── frontend/                 React Native (Expo) app
    └── src/
        ├── screens/           Welcome, LanguageSelect, About, Login, Register,
        │                       Home, Irrigation, Disease, Crops, Profile, Settings,
        │                       LocationPermission, LocationTracking, NotificationPermission
        ├── services/          api.js (axios + token refresh), notifications.js
        ├── utils/             serviceArea.js (Dambulla radius check)
        └── theme.js           shared design system
```

## Getting Started

### Prerequisites

- Python 3.x with a virtual environment
- Node.js + npm
- A Firebase project (Auth + Firestore enabled) with a service account key
- Expo CLI (`npx expo`)

### Backend setup

```bash
cd Backend
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Place your Firebase service account key at `Backend/firebase-credentials.json` (gitignored — never commit this file) and add your own `Backend/.env` (also gitignored) with any required secrets.

Run the server with UTF-8 mode, required to avoid Windows console crashes when handling Sinhala/Tamil text:

```bash
python -X utf8 manage.py migrate
python -X utf8 manage.py runserver 0.0.0.0:8000
```

### Frontend setup

```bash
cd frontend
npm install
npx expo start --clear
```

- **Android emulator:** the API base URL is set to `10.0.2.2` (host loopback) automatically for Android — see `frontend/src/services/api.js`.
- **Web:** `npx expo start --web` was used as the primary testing target during development, since native emulator location testing proved unreliable (see Testing notes below).

### Testing location on the Android emulator

The Extended Controls GPS panel is unreliable for triggering a live fix. Use ADB instead:

```bash
adb -s emulator-5554 emu geo fix <longitude> <latitude>
```

Note the order — longitude first, then latitude.

## Environment Notes

- Firebase project: Spark (free) plan. Upgrade to Blaze for production-scale use.
- The Firebase Web API key embedded in `frontend/src/services/api.js` (used for silent ID-token refresh via Google's Secure Token API) is a public client key — safe to expose client-side.
- If backend connections fail unexpectedly on Windows, check antivirus software (Avast/AVG have been known to silently block non-standard-port connections); add an exception for `Backend\venv\Scripts\python.exe` if needed.
- Sinhala/Tamil PDF exports of tabular data may suffer from font-encoding corruption — use Excel/CSV exports instead where possible.

## Known Limitations / Future Work

- "Continue with Google" (Login) and "Add Farm Plot" (Settings) are UI-only stubs, not yet functional.
- Sinhala and Tamil translations are best-effort drafts pending native-speaker review.
- No automated test suite yet — testing has been manual/exploratory to date.
- Currently scoped to the Dambulla service area (30km radius); not intended for use outside this region.

## Research Sources

Irrigation and disease thresholds are drawn from peer-reviewed and government sources, including Sumanaratne (1999, FCRDI), Fernando et al. (2018), Herath et al. (2021), Gunaratna et al. (2023), and the DCS Big Onion Survey (2021). See the accompanying thesis for full citations.

## License

See `frontend/LICENSE`.
