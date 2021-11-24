import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const Input = ({ value, name, handleChange, label, half, autoFocus, type, handleShowPassword, formData }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      value={value}
      name={name}
      onChange={handleChange}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      InputProps={name === 'user_password' || name === 'confirmPassword' ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword}>
              {type === 'password' ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : null}
      autoComplete="off"
      error={type === 'password' && name === 'confirmPassword' && formData.newPassword !== formData.confirmPassword}
      helperText={(type === 'password' && name === 'confirmPassword' && formData.newPassword !== formData.confirmPassword) ? "Comfirmed password is not equal to password" : ""}
   />
  </Grid>
);

export default Input;