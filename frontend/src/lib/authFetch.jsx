import { fetchAuthSession } from 'aws-amplify/auth';

// Uses ID token (has cognito:groups) and auto-refreshes if needed
export async function authFetch(input, init = {}) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString(); // or accessToken if your authorizer expects it
  const headers = { ...(init.headers || {}), Authorization: `Bearer ${token}` };
  return fetch(input, { ...init, headers });
}