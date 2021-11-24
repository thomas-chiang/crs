import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Paper, Grid, Typography, Container, } from "@material-ui/core"; 
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LoadingButton from '@mui/lab/LoadingButton';


import { recover } from '../../actions/auth';

import useStyles from "./styles";
import Input from "./Input";

import { useSelector } from 'react-redux';

const initialState = {
  email: "",
};


const Recover = () => {
  const { isLoadingAuth } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const classes = useStyles();
  const authData = useSelector((state) => state.auth.authData)

  useEffect(()=>{
    authData?.message==='If your email exists, you should receive an email shortly.' && window.alert(`${authData.message} Be sure to check the Spam for the mail!`)
  },[authData])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(recover(formData));
  };

  const handleChange = (e) =>
  setFormData({ ...formData, [e.target.name]: e.target.value });

  console.log(formData);

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} autoComplete="off" >
          <Grid container spacing={2}>
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
              value={formData.email}
            />
          </Grid>
          <LoadingButton
            loading={isLoadingAuth}
            style={{ marginTop: 15 }}
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

export default Recover;
