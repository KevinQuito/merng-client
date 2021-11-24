// we're using inverted too many times and it's taking up multiple lines of code each time in multiple instances, so it's better practice to
// just outsource this using this file MyPopup.js
// the Popup is just to show the user a tooltip, so they know what it is when they hover over buttons, better user experience
import React from "react";
import { Popup } from "semantic-ui-react";

function MyPopup({ content, children }) {
  return <Popup inverted content={content} trigger={children} />;
}

export default MyPopup;
