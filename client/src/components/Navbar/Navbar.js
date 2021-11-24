import React, { useState, useEffect, useCallback } from 'react'
import {  AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import useStyles from './styles';
import { Link , useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import decode from 'jwt-decode';
import * as actionType from '../../constants/actionTypes';



const Navbar = () => {

    const coach = JSON.parse(localStorage.getItem('profile'))?.result?.position;
    const isMembershiplocation = useLocation().pathname === '/manage-membership';


    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [click, setClick] = useState(true);
    

    const authData = useSelector((state) => state.auth.authData)

    const { isMyCourses } = useSelector((state) => state.courses)

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const logout = useCallback(() => {
        dispatch({ type: actionType.LOGOUT})
        history.push('/');
        setUser(null);
    },[dispatch, history]);
    
    const pageClick = useCallback(() => {
        setClick(showCmp=> !showCmp);
    },[]);

    useEffect(()=>{
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));

        if (!click) {
            return;
        }
        window.addEventListener('click', pageClick);
        return () => { 
            document.removeEventListener('click', pageClick);
        }
    },[authData, click, logout, pageClick, user?.token])

    

    return (
        <AppBar className={classes.appBar} position="static" color="inherit" >
            <div className={classes.brandContainer}>
                <Typography component={Link} to='/' className={classes.heading} variant="h4" align="center">Crs</Typography>
            </div>
            <Toolbar className={classes.toolbar}>
                
                {coach && <Button component={Link} to={isMembershiplocation ? "/courses" :"/manage-membership"} size='small' variant="contained" color="primary">{isMembershiplocation ? "Home" :"Membership"}</Button>}
                

                {user?.result ? (
                    <>  
                        {coach === '' ? 
                            isMyCourses ? (
                                <LoadingButton 
                                    variant="contained" 
                                    size='small' 
                                    color="primary" 
                                    onClick={() =>  {
                                        dispatch({ type: actionType.IS_MY_COURSES, payload: false })
                                    }}
                                >
                                    All Courses
                                </LoadingButton>
                            ) : (
                                <LoadingButton 
                                    variant="contained" 
                                    size='small' 
                                    color="primary" 
                                    onClick={() =>  {
                                        dispatch({ type: actionType.IS_MY_COURSES, payload: true })
                                    }}
                                >
                                    My Courses
                                </LoadingButton>
                            )
                        :
                        <></>
                        }
                        
                        
                        <div className={classes.profile}>
                            <Avatar style={{ maxHeight: 30, maxWidth: 30}} className={classes.purple} alt={user?.result.user_name} >
                                {user?.result.user_name.substr(user?.result.user_name.indexOf(' ')+1).charAt(0)}
                            </Avatar>
                            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
                            
                        </div>
                        <Button variant="contained" size='small' className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </>
                ) : (
                    <Button component={Link} to="/auth" size='small' variant="contained" color="primary">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
