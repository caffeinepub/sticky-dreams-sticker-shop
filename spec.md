# Sticky Dreams Sticker Shop

## Current State
The admin page at `/admin` requires users to sign in via Internet Identity AND have the `caffeineAdminToken` URL parameter present at the time of login. The first person to sign in with the correct token becomes the permanent admin. If the token was missing or lost during redirect, the user is permanently registered as a non-admin and cannot gain admin access.

## Requested Changes (Diff)

### Add
- A password input form on the admin page itself (shown after sign-in) so the user can type the admin secret directly in the UI
- When submitted, call `_initializeAccessControlWithSecret` with the typed password -- if correct and admin slot is unclaimed, the caller becomes admin
- A clear "Enter Admin Password" UI step between "sign in" and the admin dashboard

### Modify
- AdminPage.tsx: Add a third state after isLoggedIn -- if not yet admin, show a password entry form instead of "Access Denied"
- The password form should call the backend with the typed token to try claiming admin role, then re-check `isCallerAdmin`

### Remove
- The hard "Access Denied" dead-end screen -- replace with the password prompt so users always have a way to authenticate as admin

## Implementation Plan
1. In AdminPage.tsx, after the user is signed in but `isAdmin` is false, show a "Enter Admin Password" form with a password input and submit button
2. On submit, call `actor._initializeAccessControlWithSecret(password)` then invalidate the `isAdmin` query to re-check
3. If it fails (wrong password or already taken), show an error message
4. Keep the sign-in flow unchanged -- Internet Identity sign-in still required first
