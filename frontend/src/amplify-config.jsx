// src/amplify-config.jsx
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      // ✅ v6 keys live under Auth.Cognito
      region: 'us-east-1',
      userPoolId: 'us-east-1_8bMnXBmfA',
      // NOTE: v6 uses userPoolClientId (not userPoolWebClientId)
      userPoolClientId: '7oiq66djeossfda2i54g227lhb',

      // ✅ Hosted UI / OAuth config lives under loginWith.oauth
      loginWith: {
        oauth: {
          domain: 'us-east-18bmnxbmfa.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'], // add profile if you want name, etc.
          // v6 expects arrays for redirects
          redirectSignIn: ['http://localhost:5173/'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code', // recommended (Authorization Code + PKCE)
          // If you *really* need implicit: responseType: 'token'
        },
      },
    },
  },
});

