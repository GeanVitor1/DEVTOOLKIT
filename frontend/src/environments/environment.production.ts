/**
 * Production defaults.
 * - Leave apiBaseUrl empty when calling relative /api (nginx docker or same host).
 * - On Vercel, `npm run build` runs scripts/set-env.mjs which overwrites this file
 *   with NG_APP_API_URL (your Render HTTPS origin, no trailing slash).
 */
export const environment = {
  production: true,
  apiBaseUrl: ''
};
