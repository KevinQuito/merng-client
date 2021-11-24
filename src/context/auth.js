import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode"; // we can use this to decode our token

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  // this token stores an expiration date and time, this expiration is encoded inside the token, so we need to decode it
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  // exp is where the expiration of the time EPOC date is stored, need to multiply it by 1000 since it's in milliseconds
  if (decodedToken.exp * 1000 < Date.now()) {
    // here the token is expired, so they are logged out
    localStorage.removeItem("jwtToken");
  } else {
    // here it's not actually expired, so we need to set our user here since it would still be a valid token
    initialState.user = decodedToken;
  }
}

// we have a login that will take in data username/password and do something, and we have a logout that doesn't take in anything and do something
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

// a reducer is receives an action, a type, and a payload and determines what to do depending on your application
function authReducer(state, action) {
  // depending on the type, the action will do something
  switch (action.type) {
    // we spread the existing state, and we want to add the user
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    //when we logout, we just want to clear the user of the data and set the user back to null
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  // we give the useReducer the authReducer and an initial state because we need initialState as a dynamic value
  const [state, dispatch] = useReducer(authReducer, initialState);

  // now we can use that dispatch to dispatch any action and attach to it a type and a payload, and once that's dispatched, the authReducer will listen to it
  // and perform any action according to that dispatch action

  function login(userData) {
    // in here we need to persist the user once they're logged in, so that whenever they refresh the page, they wont get automatically logged out
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  // this will not have any payload because that's how logout works
  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      // here our value is a javascript object, so we need to wrap it in 2 curly braces
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

// need to export AuthContext since we're going to be using it for our components to access the context.
// need to export AuthProvider since we're using it to wrap our App.js, so that it can have access to this provider to these functions from the context
export { AuthContext, AuthProvider };
