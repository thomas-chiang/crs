import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Paper, Grid, Typography, Container, } from "@material-ui/core"; 
import LoadingButton from '@mui/lab/LoadingButton';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { resetpassword } from '../../actions/auth';

import useStyles from "./styles";
import Input from "./Input";

import { useSelector } from 'react-redux';

import { useLocation } from "react-router-dom";

const initialState = {
  newPassword: "",
  confirmPassword: ""
};


const ResetPassword = () => {
  const { isLoadingAuth } = useSelector((state) => state.auth)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search)
  console.log({location, searchParams: searchParams.toString()})
  const token = searchParams.get("token");
  console.log(token);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const classes = useStyles();
  const authData = useSelector((state) => state.auth.authData)
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  useEffect(()=>{
    authData?.message==='Password successfully reset.' && window.alert(authData.message)
    authData==='This link is either expired or invalid.' && window.alert(authData)

  },[authData])

  const validate = () => {
    let disableSubmit = false;
    if (formData.confirmPassword !== formData.newPassword) disableSubmit = true;
    return disableSubmit;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetpassword(formData,token));
  };

  const handleChange = (e) =>
  setFormData({ ...formData, [e.target.name]: e.target.value });

  

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create New Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} autoComplete="off" >
          <Grid container spacing={2}>
            <Input
              name="newPassword"
              label="New Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
              formData={formData}
              value={formData.newPassword}
            />
            <Input
                name="confirmPassword"
                label="Repeat New Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                formData={formData}
                handleShowPassword={handleShowPassword}
              />
          </Grid>
          <LoadingButton
            loading={isLoadingAuth}
            style={{ marginTop: 15 }}
            disabled={validate()}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            submit
          </LoadingButton>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
