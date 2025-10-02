// src/components/LoginComp.jsx
import { useEffect, useState } from 'react';
import { signInWithRedirect, signOut, getCurrentUser } from 'aws-amplify/auth';

export default function LoginComp() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();  // throws if not signed in
        if (!mounted) return;
        setSignedIn(true);
        setEmail(user?.signInDetails?.loginId || '');
      } catch {
        if (!mounted) return;
        setSignedIn(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (signedIn) {
    return (
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <span>{email}</span>
        <button onClick={() => signOut({ global: true }).then(() => window.location.assign('/'))}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signInWithRedirect()}>
      Sign in / Sign up
    </button>
  );
}

