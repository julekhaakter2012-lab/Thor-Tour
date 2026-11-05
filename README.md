# THOR TOUR — Separate Main Website + Admin Console

## Files
- `index.html` — public THOR TOUR website. No Admin Panel button/menu is shown.
- `admin.html` — the separate Admin Console supplied by you, adapted for THOR TOUR.
- `manifest.webmanifest`, `sw.js` — main website PWA.
- `manifest-admin.webmanifest`, `sw-admin.js` — separate Admin PWA cache.
- `icons/` — app icons used by both installs.

## Admin login
1. Open `https://YOUR-DOMAIN/admin.html`.
2. Sign in with Google.
3. Enter the Admin Access Key: `api.thor.tour.dev`.

No separate Render API service or backend deployment is included or required for this simple client-side gate.

## Important security note
The access key is checked in the browser, so it can be discovered by someone who inspects the HTML/JavaScript. It only gates the Admin Console UI; it does **not** grant Firebase Realtime Database permissions. Firebase Database Rules still decide which reads/writes are allowed. For real protection, configure Firebase Rules to allow admin-only paths only to an already-authorized UID or a verified Firebase custom claim. A browser-only key cannot securely create admin privileges.

## Deploy
Upload all files and the `icons` folder to the root of the same static-site repository. Keep `index.html` and `admin.html` side by side. Deploy the static site over HTTPS. The public website opens at `/`; the Admin Console opens directly at `/admin.html`.

## Notes
- The main website and Admin Console have separate service-worker cache namespaces.
- Firebase, authentication, payment and database requests are not cached by the service workers.
- The Admin page keeps the Firebase project configuration from the supplied file.
