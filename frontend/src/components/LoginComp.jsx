// src/components/LoginComp.jsx
import { useEffect, useState } from 'react';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { OAUTH_REDIRECTS, COGNITO } from '../amplify-config';

const isDev = import.meta.env.DEV;
const REDIRECT = isDev ? OAUTH_REDIRECTS.DEV : OAUTH_REDIRECTS.PROD;

export default function LoginComp() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('forceLogin') === '1') {
      window.history.replaceState({}, '', window.location.pathname);
      signInWithRedirect(); // uses Amplify.configure redirects
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await fetchAuthSession();
        const user = await getCurrentUser();
        if (!mounted) return;
        setSignedIn(true);
        setEmail(user?.signInDetails?.loginId || '');
      } catch {
        if (!mounted) return;
        setSignedIn(false);
        setEmail('');
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function handleSignOut() {
    try {
      await signOut({ global: true }); // clears local + hosted session cookies
    } finally {
      // Redirect through Hosted UI logout so Cognito clears its cookies too
      const url =
        `https://${COGNITO.domain}/logout?client_id=${encodeURIComponent(COGNITO.clientId)}` +
        `&logout_uri=${encodeURIComponent(REDIRECT)}`;
      window.location.href = url;
    }
  }

  return signedIn ? (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>{email}</span>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  ) : (
    <button onClick={() => signInWithRedirect()}>
      Sign in / Sign up
    </button>
  );
}




