import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={credentialResponse => console.log(credentialResponse)}
        onError={() => console.log("Login Failed")}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
