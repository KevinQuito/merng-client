// import React, { Component } from 'react' // instead of component, we'll get useState
import React, { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

// we need to show context since we want to show a different menu bar depending on if we're logged in or not
import { AuthContext } from '../context/auth';


// This is a class based component so, we'll change it; we only want functional components
// export default class MenuExampleSecondaryPointing extends Component {
function MenuBar() {
  const { user, logout } = useContext(AuthContext)

  //   state = { activeItem: 'home' }
  // We can make home the default page by stating = useState('home') below
  // const [activeItem, setActiveItem] = useState("home");
  // we need to make it so that the Menu olive color will highlight the right MenuBar name if the user uses localhost:3000/Login rather than clicking
  // on the Login MenuBar button
  const pathname = window.location.pathname;
  // /login or /register
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  //   const handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  const handleItemClick = (e, { name }) => setActiveItem(name);

  // we don't need to render since this is a functional component
  //   render() {
  // const { activeItem } = this.state
  // each menu item has a name, meaning if the active property is true, then it will be highlighted, indicating that we're active on the page right now
  
  // if user is logged in, then we want to show something, else show Login/Register menu bar
  const menuBar = user ? (
    // we want it to always be active, so we'll remove the condition, it wont have an onClick, but it's going to be a link to the home
    <Menu pointing secondary size="massive" color="olive">
      <Menu.Item
        name={user.username}
        active
        as={Link}
        to="/"
      />
    {/* will trigger the context function logout from ../context/auth.js */}
      <Menu.Menu position="right">
        <Menu.Item
          name="logout"
          onClick={logout}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="olive">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  )
  
  return menuBar;
}
// }

export default MenuBar;
