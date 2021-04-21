import React, { useContext, useRef, useEffect, useState } from "react";
import { userContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { JsonWebTokenError } from "jsonwebtoken";
import Search_button from "./Search_button";

const NavBar = () => {
  const { state, dispatch } = useContext(userContext);
  const [userDetails, setUserDetails] = useState([]);
  const history = useHistory();


  const renderList = () => {
    //show different links depends on logged in or logged out
    if (state) {
      return [
        <li key="1">
          <Search_button />
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/createpost">Upload Post</Link>
        </li>,
        <li key="4">
          <Link to="/explore">Explore</Link>
        </li>,
        <li key="5">
          <button
            className="btn waves-effect waves-light #e91e63 pink"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Sign in</Link>
        </li>,
        <li>
          <Link to="/signup">Sign up</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white" style={{ color: "black" }}>
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
