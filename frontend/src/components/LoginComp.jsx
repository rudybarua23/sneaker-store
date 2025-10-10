// src/components/LoginComp.jsx
import { useEffect, useState } from 'react';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const COGNITO_DOMAIN  = 'us-east-18bmnxbmfa.auth.us-east-1.amazoncognito.com';
const CLIENT_ID       = '7oiq66djeossfda2i54g227lhb';
const REDIRECT_URI    = 'http://localhost:5173/'; // must be in Allowed Callback URLs
const LOGOUT_REDIRECT = 'http://localhost:5173/'; // must be in Allowed Sign-out URLs

export default function LoginComp() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('');

  // If we came back from the "switch account" hop, kick off the Amplify flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('forceLogin') === '1') {
      // Clean the URL (optional)
      window.history.replaceState({}, '', window.location.pathname);
      // Start the OAuth flow *via Amplify* so it handles the code->token exchange
      signInWithRedirect();
    }
  }, []);

  // Hydrate auth state (ensures tokens are ready before reading current user)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Makes sure session/tokens are loaded if we just returned from Hosted UI
        await fetchAuthSession();
        const user = await getCurrentUser(); // throws if not signed in
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

  // --- SIGN OUT: local + Hosted UI cookies ---
  async function handleSignOut() {
    try {
      await signOut({ global: true });
    } finally {
      const url =
        `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}` +
        `&logout_uri=${encodeURIComponent(LOGOUT_REDIRECT)}`;
      window.location.href = url;
    }
  }

  if (signedIn) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>{email}</span>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {/* Default smooth sign-in via Amplify (uses existing Hosted UI session if present) */}
      <button onClick={() => signInWithRedirect()}>
        Sign in / Sign up
      </button>
    </div>
  );
}



