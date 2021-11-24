import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Recover from './components/Recover/Recover';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ManageMembership from './components/ManageMembership/ManageMembership';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { io } from "socket.io-client";

const App = () => {

  const [ socket, setSocket ] = useState(null)
 
  useEffect(() => {
      setSocket( io(process.env.REACT_APP_SERVER_URL) );
  },[])

  return (
    <BrowserRouter>
    <Container maxWidth={false} >
      <Navbar socket={socket} />
      <Switch>
        <Route path="/" exact component={() => <Redirect to="/courses" />} />
        <Route 
          path='/courses' 
          exact 
          render={(props) => <Home {...props} socket={socket} />}
        />
        <Route 
          path="/courses/search" 
          exact 
          render={(props) => <Home {...props} socket={socket} />}
        />
        <Route path='/auth' exact component={Auth} />
        <Route path='/recover' exact component={Recover} />
        <Route path='/password-reset' exact component={ResetPassword} />
        <Route 
          path='/manage-membership' 
          exact 
          render={(props) => <ManageMembership {...props} socket={socket} />}
        />
      </Switch>
    </Container>
    </BrowserRouter>
  );
};

export default App;
