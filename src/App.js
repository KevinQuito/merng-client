import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

// MenuBar will be on the page regardless of what page we're in, so we don't need to put an exact path
function App() {
  return (
    // <Router>
    //     <Container>
    //       <MenuBar />
    //       <Routes>
    //         <Route exact path="/" element={<Home/>}/>
    //         <Route exact path="/login" element={<Login/>}/>
    //         <Route exact path="/register" element={<Register/>}/>
    //       </Routes>
    //     </Container>
    // </Router>
    // we will wrap the entire code above with AuthProvider, so everything inside of AuthProvider will have access to context/auth
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* We use authroute here instead of route, so that if the user is logged in and tries to access the login/register pages using the web address,
                then we'll redirect them to the home page */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/posts/:postId" element={<SinglePost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
