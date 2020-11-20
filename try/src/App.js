import React,{useEffect,createContext,useReducer, useContext} from 'react';

import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter,Route,useHistory,Switch} from 'react-router-dom';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';

import SignUp from './components/screens/SignUp';
import CreatePost from './components/screens/CreatePost';
import {initialState, reducer} from './reducers/useReducers';
import UserProfile from './components/screens/UserProfile';
import SubscribeUserPosts from './components/screens/SubscribeUserPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
export const UserContext=createContext();

const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:'USER',payload:user});
     
    }
   else{
   
           history.push('/signin')
    }
    
  }, []);
  return(
    <Switch>
    <Route exact path="/">
    <Home/>
  </Route>
  <Route path="/signin">
    <Login/>
  </Route>
  <Route path="/signup">
    <SignUp/>
  </Route>
  
  <Route exact path="/profile">
    <Profile/>
  </Route>
  <Route path="/create">
    <CreatePost/>
  </Route>
  <Route path="/profile/:userid">
    <UserProfile/>
  </Route>
  <Route path="/myfollowerpost">
    <SubscribeUserPosts/>
  </Route>
  <Route exact path="/reset">
    <Reset/>
  </Route>
  <Route path="/reset/:token">
    <NewPassword/>
  </Route>
  </Switch>

  )
}
function App() {
const [state,dispatch]=useReducer(reducer,initialState);

  return (
    <UserContext.Provider value={{state,dispatch }}>
    <BrowserRouter>
    <Navbar/>
   <Routing/>
    </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
