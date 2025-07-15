import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_8bMnXBmfA", // your user pool
  client_id: "7oiq66djeossfda2i54g227lhb", // your app client ID
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid email profile",
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
