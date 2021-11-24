import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Grow,
  Grid,
  AppBar,
  Button,
} from "@material-ui/core";
import useStyles from "./styles";
import Courses from "../Courses/Courses";
import Form from "../Form/Form";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, getCoursesBySearch } from "../../actions/courses";
import { getCourseUsers } from "../../actions/courseUser";
import { useHistory, useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import moment from 'moment'
import LoadingButton from '@mui/lab/LoadingButton';
import { getUsers } from '../../actions/auth';


function useUrl() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ socket }) => {

 
  
  const { isSearchingCourse/* , courses */ } = useSelector((state) => state.courses)


  const coach = JSON.parse(localStorage.getItem('profile'))?.result?.position;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [courseEditId, setCourseEditId] = useState(null);
  const [courseCopyId, setCourseCopyId] = useState(null);
  const query = useUrl();
  const getlocation = useCallback((location) =>{
    return query.get(location) || ''
    },
    [query]
  );
  const history = useHistory();
  const isSearchQuery = query.get("searchCourseName") + query.get("searchCoach") + query.get("searchTime") + query.get("searchStartTime") + query.get("searchEndTime");
  const [searchCourseName, setSearchCourseName] = useState(getlocation('searchCourseName'));
  const [searchCoach, setSearchCoach] = useState(getlocation('searchCoach'));
  const [searchTime, setSearchTime] = useState(getlocation('searchTime'));
  const [searchStartTime, setSearchStartTime] = useState(new Date(getlocation('searchStartTime') || Date.now() - (3600 * 1000 * 24)));
  const [searchEndTime, setSearchEndTime] = useState(new Date(getlocation('searchEndTime') || Date.now() + (3600 * 1000 * 24 * 30)));

  const searchStartTimeISO = moment(searchStartTime, moment.ISO_8601, true).isValid() ? searchStartTime?.toISOString() : new Date(Date.now() - (3600 * 1000 * 24)).toISOString()
  const searchEndTimeISO = moment(searchEndTime, moment.ISO_8601, true).isValid() ? searchEndTime?.toISOString() :  new Date(Date.now() + (3600 * 1000 * 24 * 365)).toISOString()

  const isSearchInvalid = () => {
    if(
        (searchEndTime === null || moment(searchEndTime, moment.ISO_8601, true).isValid()) 
        && (searchStartTime === null || moment(searchStartTime, moment.ISO_8601, true).isValid())
        && (searchCourseName || searchCoach || searchTime || searchStartTime || searchEndTime)
      ) {
      return false;
    } else {
      return true;
    }
  }

  

  const searchCourse = () => {
    if (searchCourseName || searchCoach || searchTime || searchStartTime || searchEndTime) {
      dispatch(getCoursesBySearch({ searchCourseName, searchCoach, searchTime, searchStartTime: searchStartTimeISO, searchEndTime: searchEndTimeISO }));
      history.push(`/courses/search?searchCourseName=${searchCourseName || ''}&searchCoach=${searchCoach || ''}&searchTime=${searchTime || ''}&searchStartTime=${searchStartTimeISO}&searchEndTime=${searchEndTimeISO}`);
    } else {
      history.push('/');
    }
  };

  const refreshSearchCourseName = getlocation('searchCourseName')
  const refreshSearchCoach = getlocation('searchCoach')
  const refreshSearchTime = getlocation('searchTime') 

 

  useEffect(() => {
    if (isSearchQuery) {
      dispatch(getCoursesBySearch({ 
        searchCourseName: refreshSearchCourseName, 
        searchCoach: refreshSearchCoach, 
        searchTime: refreshSearchTime, 
        searchStartTime: searchStartTimeISO, 
        searchEndTime: searchEndTimeISO 
      }));
    } else {
      dispatch(getCourses()); 
    }
    dispatch(getCourseUsers());
    dispatch(getUsers())  
  }, [
    dispatch,  
    refreshSearchCourseName, 
    refreshSearchCoach, 
    refreshSearchTime, 
    searchStartTimeISO, 
    searchEndTimeISO, 
    isSearchQuery,
    ]
  ); 


  useEffect(()=>{
    socket?.on('updateCourseUsers',({socketId})=>{
      if(socketId !== socket.id) {
        setTimeout(() => {
          dispatch(getCourseUsers())
          console.log('updateCourseUsers')
        }  
        , 3000 )
        setTimeout(() => {
          dispatch(getCourseUsers())
          console.log('comfirmedUpdateCourseUsers')
        }  
        , 10000 )
      }
    })
  },[socket, dispatch])

  useEffect(()=>{
    socket?.on('updateCourses',({socketId})=>{
      if(socketId !== socket.id) {
        setTimeout(() => {
          dispatch(getCourses())
          console.log('updateCourses')
        }  
        , 5000 )
      }
    })
  },[socket, dispatch])
  
  useEffect(()=>{
    socket?.on('updateUsers',({socketId})=>{
    if(socketId !== socket.id) {
        setTimeout(() => {
            dispatch(getUsers())
        console.log('updateUsers')
        }  
        , 3000 )
        setTimeout(() => {
            dispatch(getUsers())
        console.log('updateUsers')
        }  
        , 3000 )
    }
    })
  },[socket, dispatch])
  

  const clearSearch = () => {
    setSearchCourseName('')
    setSearchCoach('')
    setSearchTime('')
    setSearchStartTime(new Date(Date.now() - (3600 * 1000 * 24)))
    setSearchEndTime(new Date(Date.now() + (3600 * 1000 * 24 * 30))) 
    history.replace(`/courses/search?searchCourseName=${''}&searchCoach=${''}&searchTime=${''}&searchStartTime=${searchStartTimeISO}&searchEndTime=${searchEndTimeISO}`);
  }


  return (
    <Grow in>
      <Container disableGutters maxWidth={false}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={1}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={8} md={9}>
            <Courses
              courseEditId={courseEditId}
              setCourseCopyId={setCourseCopyId}
              setCourseEditId={setCourseEditId}
              socket={socket}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>



            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
              
            >
              <TextField
                size='small'
                inputProps={{ style: { fontSize: 13 } }}
                InputLabelProps={{ style: { fontSize: 13 } }}
                name="searchCourseName"
                variant="outlined"
                label="Course title"
                fullWidth
                value={searchCourseName}
                onChange={(e) => setSearchCourseName(e.target.value)}
              />
              <TextField
                size='small'
                inputProps={{ style: { fontSize: 13 } }}
                InputLabelProps={{ style: { fontSize: 13 } }}
                name="searchCoach"
                variant="outlined"
                label="Coach"
                fullWidth
                value={searchCoach}
                onChange={(e) => setSearchCoach(e.target.value)}
              />
              <TextField
                size='small'
                inputProps={{ style: { fontSize: 13 } }}
                InputLabelProps={{ style: { fontSize: 13 } }}
                name="searchTime"
                variant="outlined"
                label="Time"
                fullWidth
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)}
              />
              <Grid container spacing={1}>
                <Grid item xs={6} >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            
                            inputProps={{ style: { fontSize: 13 } }}
                            InputLabelProps={{ style: { fontSize: 13 } }}
                            name="searchStartTime"
                            label="From"
                            value={searchStartTime}
                            onChange={(e) => setSearchStartTime(e)}
                            renderInput={(params) => (
                                <TextField 
                                  InputLabelProps={{ style: { fontSize: 13 } }}
                                  size='small'
                                  fullWidth variant="outlined" {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6} >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            inputProps={{ style: { fontSize: 13 } }}
                            InputLabelProps={{ style: { fontSize: 13 } }}
                            name="searchEndTime"
                            label="To"
                            value={searchEndTime}
                            onChange={(e) => setSearchEndTime(e)}
                            renderInput={(params) => (
                                <TextField 
                                  InputLabelProps={{ style: { fontSize: 13 } }}
                                  size='small'
                                  fullWidth variant="outlined" {...params} 
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
              </Grid>      
              <Grid container spacing={1}>
                <Grid item xs={6} >
                  <LoadingButton
                    loading={ isSearchingCourse }
                    disabled={isSearchInvalid()}
                    onClick={searchCourse}
                    className={classes.searchButton}
                    style={{marginTop: "5px"}}
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                  >
                    Search
                  </LoadingButton>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={clearSearch}
                    className={classes.searchButton}
                    style={{marginTop: "5px"}}
                    variant="contained"
                    color="secondary"
                    size="small"
                    fullWidth
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </AppBar>



            {coach && 
            <Form
              courseEditId={courseEditId}
              setCourseEditId={setCourseEditId}
              courseCopyId={courseCopyId}
              setCourseCopyId={setCourseCopyId}
              socket={socket}
            />
            }
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
