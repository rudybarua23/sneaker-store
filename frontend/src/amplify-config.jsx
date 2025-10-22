// src/amplify-config.jsx
import { Amplify } from 'aws-amplify';

const DEV  = 'http://localhost:5173/';
const PROD = 'https://dxfbbjnnl2x5b.cloudfront.net/';

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
          redirectSignIn: [DEV, PROD],
          redirectSignOut: [DEV, PROD],
          responseType: 'code', // recommended (Authorization Code + PKCE)
          // If you *really* need implicit: responseType: 'token'
        },
      },
    },
  },
});

// export these so component can reuse them for logout URL
export const OAUTH_REDIRECTS = { DEV, PROD };
export const COGNITO = {
  domain: 'us-east-18bmnxbmfa.auth.us-east-1.amazoncognito.com',
  clientId: '7oiq66djeossfda2i54g227lhb',
};

