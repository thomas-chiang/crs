import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from "@material-ui/core"; 
import { useHistory } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { signin, signup } from '../../actions/auth';
import useStyles from "./styles";
import Input from "./Input";
import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import * as actionType from '../../constants/actionTypes';



const initialState = {
  firstName: "",
  lastName: "",
  user_email: "",
  user_password: "",
  confirmPassword: "",
  position: "",
};

const Auth = () => {

  
  const { isLoadingAuth } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const authData = useSelector((state) => state.auth.authData)
  const [alert, setAlert] = useState(authData);
  const [isCoachSignup, setIsCoachSignup] = useState(false);
  const [secret, Setsecret] = useState(null)
 
  useEffect(()=>{
    if (authData==='Email or Password is wrong') {
      window.alert(authData+'. Or your internet connecting has some problems')
      dispatch({ type: actionType.WRONG, payload: '' })
    }  
    if (authData==='User already exists') {
      window.alert(authData+'. Or your internet connecting has some problems')
      dispatch({ type: actionType.WRONG, payload: '' })
    } 
  },[authData, alert, dispatch])

  const handleShowPassword = () => setShowPassword(!showPassword);
 
  const switchMode = () => {
    setFormData(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const coachMode = () => {
    setFormData(initialState); 
    if(!isCoachSignup) {
      setFormData({ ...formData, position: "coach" })
    } else {
      setFormData({ ...formData, position: "" })
    }
    setIsCoachSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signup(formData, history));
      window.alert('Make sure to activate your membership by your coach!')
    } else {
      dispatch(signin(formData, history));
      authData !== null && setAlert(authData);
    }
  };

  const handleChange = (e) =>
  setFormData({ ...formData, [e.target.name]: e.target.value });


  const validate = () => {
    let disableSubmit = false;
    if (formData.confirmPassword !== formData.user_password) disableSubmit = true;
    if (isCoachSignup && secret !=='ppabewsrC') disableSubmit = true;
    return disableSubmit;
  }

  const validateCrsCode = () => {
    let disableSubmit = false;
    if (isCoachSignup && secret !=='ppabewsrC') disableSubmit = true;
    return disableSubmit;
  }

  const handleSecret = (e) => Setsecret(e.target.value);

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ?  (isCoachSignup ? "Coach sign up" : "Sign up") : "Sign in"}
        </Typography>
        {isSignup ? 
          <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={coachMode}>
                  {isCoachSignup
                    ? "Normal Member? Sign Up here"
                    : "Coach?  Sign Up here"}
                </Button>
              </Grid>
          </Grid>
          : <></>}

        <form className={classes.form} onSubmit={handleSubmit} autoComplete="off" >
          <Grid container spacing={2}>
            {(isCoachSignup && isSignup) && (
              <Grid item xs={12}>
                <TextField
                  size="small"
                  onChange={handleSecret}
                  variant="outlined"
                  required
                  fullWidth
                  label="Contact Crs for coach signup secret"
                  autoComplete="off"
                  error={validateCrsCode()}
             />
            </Grid>
            )}
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="user_email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
              value={formData.user_email}
            />
            <Input
              name="user_password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
              value={formData.user_password}
            />
            
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                formData={formData}
                handleShowPassword={handleShowPassword}
              />
            )}
            
          </Grid>
          {isSignup ?  '' :
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={()=>{history.push("/recover")}}>
                Forget password? 
              </Button>
            </Grid>
          </Grid>
          }
          <LoadingButton
            loading={isLoadingAuth}
            style={{ marginTop: 15 }}
            disabled={isSignup ? validate(): false}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {" "}
            {isSignup ? "Sign Up" : "Sign In"}
          </LoadingButton>

        
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
