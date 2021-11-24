// this will be the opposite of the protected route component, what this file will do is instead of the login/register routes
// we'll have an AuthRoute, where if we're logged in, and we try to go to /login or /register, then it will redicret us to home
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/auth";

// this function will take in a component with an alias of Component
function AuthRoute({ children }) {
  const { user } = useContext(AuthContext);

  return (
    // if the user is already logged in, then they will be redirected to home
          user ? <Navigate to="/" /> : children      
  );
}

export default AuthRoute;
