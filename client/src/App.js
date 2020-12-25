import "./App.css";
import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./component/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./component/screen/Home";
import SignIn from "./component/screen/Signin";
import Profile from "./component/screen/Profile";
import Signup from "./component/screen/Signup";
import CreatePost from "./component/screen/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './component/screen/UserProfile'
import FollowPost from './component/screen/FollowPost'

//global state
export const userContext = createContext();

//since we can not create useHistory componenet, create a function that includes switch so we can use useHistory()
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      <Route path="/explore">
        <Home />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/profile" exact={true}>
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/" exact={true}>
        <FollowPost />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
