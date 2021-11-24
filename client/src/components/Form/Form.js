import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { TextField, Typography, Paper, Button, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { createCourse, updateCourse } from '../../actions/courses';
import LoadingButton from '@mui/lab/LoadingButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker } from '@mui/lab';
import { useSelector } from 'react-redux';
import { updateCourseUser } from '../../actions/courseUser';
import { useHistory } from 'react-router-dom';


const Form = ({ courseEditId, setCourseEditId, courseCopyId, setCourseCopyId, socket }) => {
  
  const { isLoading, isUpdatingCourse, isCreatingCourse } = useSelector((state) => state.courses)
  const history = useHistory();
  
  const [courseData, setCourseData] = useState({
    course_name: '',
    course_time: new Date(Date.now() + (3600 * 1000 * 24 * 3)),
    course_capacity: 0,
    course_signup_time: new Date(),
    coach: '',
    quit_deadline: new Date(Date.now() + (3600 * 1000 * 24 * 2))
  });

  const courseByCourseEditId = useSelector((state) => courseEditId ? state.courses.courses.find((course) => course.course_id === courseEditId) : null)

  const courseByCourseCopyId = useSelector((state) => courseCopyId ? state.courses.courses.find((course) => course.course_id === courseCopyId) : null)

  const user = JSON.parse(localStorage.getItem('profile'));
  
  const { courseUsers } = useSelector((state) => state.courseUsers)
  const  courseUsersOfThisCourseSortedByTime  = courseUsers.filter(
    (courseUser) => courseUser.course_id === courseEditId
  ).sort(function (x, y) {
    return new Date(x.course_user_created_at).getTime() - new Date(y.course_user_created_at).getTime();
  }); 

  const isWaitingUsers = courseUsersOfThisCourseSortedByTime.filter((courseUser) => courseUser.is_waiting === true)
  
  const AlreadyInUsers = courseUsersOfThisCourseSortedByTime.filter((courseUser) => courseUser.is_waiting === false)

  useEffect(() => {
    if (courseByCourseEditId) setCourseData(courseByCourseEditId);
    if (courseByCourseCopyId) setCourseData(courseByCourseCopyId);
  }, [courseByCourseEditId, courseByCourseCopyId])

  const courseAction = () => {
    if (courseEditId) {
      return 'Edit ';
    } else if (courseCopyId) {
      return 'Copy ';
    } else {
      return 'Create ';
    }
  }

  const courseActionColor = () => {
    if (courseEditId) {
      return 'orange';
    } else if (courseCopyId) {
      return 'green';
    } else {
      return 'black';
    }
  }



  const dispatch = useDispatch();

  const classes = useStyles();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseEditId) {
      dispatch(updateCourse(courseEditId, courseData));
      socket.emit('changeCourses', {
        socketId: socket.id
      })
      if( courseData.course_capacity >  AlreadyInUsers.length && isWaitingUsers.length !== 0 ) {
        for ( let i = 0; i < (courseData.course_capacity -  AlreadyInUsers.length); i++){
          dispatch(updateCourseUser({
            user_id: isWaitingUsers[i].user_id,
            course_id : courseEditId,
            is_waiting: false
          }))
        }
      } 

      if( courseData.course_capacity < AlreadyInUsers.length ) {
        for ( let i = 0; i < ( AlreadyInUsers.length - courseData.course_capacity ); i++){
          dispatch(updateCourseUser({
            user_id: AlreadyInUsers[(AlreadyInUsers.length-1) - i].user_id,
            course_id : courseEditId,
            is_waiting: true
          }))
        }
      } 
    } else {
      dispatch(createCourse(courseData, history));
      socket.emit('changeCourses', {
        socketId: socket.id
      })
      clear();
    }
  };


  const clear = () => {
    setCourseEditId(null);
    setCourseCopyId(null);
    setCourseData({
      /* course_creator: '', */
      course_name: '',
      course_time: new Date(Date.now() + (3600 * 1000 * 24 * 3)),
      course_capacity: 0,
      course_signup_time: new Date(),
      coach: '',
      quit_deadline: new Date(Date.now() + (3600 * 1000 * 24 * 2))
    })
  };

  const errorInput = {
    course_name: courseData.course_name.length < 1,
    course_time: courseData.course_time === '',
    course_capacity: courseData.course_capacity < 1,
    course_signup_time: courseData.course_signup_time.length < 1,
    coach: courseData.coach.length < 1,
    quit_deadline: courseData.quit_deadline.length < 1
  }
  const validate = () => {
    let disableSubmit = false;
    if (
      errorInput.course_name ||
      errorInput.course_time ||
      errorInput.course_capacity ||
      errorInput.course_signup_time ||
      errorInput.coach ||
      errorInput.quit_deadline
    ) disableSubmit = true;
    return disableSubmit;
  }

  if (!user?.result?.user_name) {
    return <></>
  }

  return (
      <Paper className={classes.paper} elevation={6}>
          <form
              autoComplete="off"
              className={`${classes.root} ${classes.from}`}
              onSubmit={handleSubmit}
          >
              <Typography variant="h6" className={classes[courseActionColor()]} style={{fontSize: 18}}>
                  {courseAction()}a course
              </Typography>
              <TextField
                  size='small'
                  inputProps={{ style: { fontSize: 13 } }}
                  InputLabelProps={{ style: { fontSize: 13 } }}
                  required
                  error={errorInput.course_name}
                  name="course_name"
                  variant="outlined"
                  label="Title"
                  fullWidth
                  value={courseData.course_name}
                  onChange={(e) =>
                      setCourseData({
                          ...courseData,
                          course_name: e.target.value,
                      })
                  }
              />
          <Grid container spacing={1} justifyContent="space-around" alignItems="stretch">
            <Grid item xs={7}>
             <TextField
                  size='small'
                  inputProps={{ style: { fontSize: 13 } }}
                  InputLabelProps={{ style: { fontSize: 13 } }}
                  required
                  error={errorInput.coach}
                  name="coach"
                  variant="outlined"
                  label="Coach"
                  fullWidth
                  value={courseData.coach}
                  onChange={(e) =>
                      setCourseData({
                          ...courseData,
                          coach: e.target.value,
                      })
                  }
              />
            </Grid>
            <Grid item xs={5}>
               <TextField
                  inputProps={{ style: { fontSize: 13 } }}
                  InputLabelProps={{ style: { fontSize: 13 } }}
                  size='small'
                  required
                  error={errorInput.course_capacity}
                  type="number"
                  name="course_capacity"
                  variant="outlined"
                  label="Size"
                  fullWidth
                  value={courseData.course_capacity}
                  onChange={(e) =>
                      setCourseData({
                          ...courseData,
                          course_capacity: Number(e.target.value),
                      })
                  }
              />
            </Grid>
          </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                      inputProps={{ style: { fontSize: 13 } }}
                      InputLabelProps={{ style: { fontSize: 13 } }}
                      error={errorInput.course_time}
                      name="course_time"
                      label="Time"
                      value={courseData.course_time}
                      onChange={(e) =>
                          setCourseData({ ...courseData, course_time: e })
                      }
                      renderInput={(params) => (
                          <TextField 
                            InputLabelProps={{ style: { fontSize: 13 } }}
                            required
                            size='small'
                            fullWidth variant="outlined" {...params} 
                          />
                      )}
                  />
              </LocalizationProvider>
             
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                      inputProps={{ style: { fontSize: 13 } }}
                      InputLabelProps={{ style: { fontSize: 13 } }}
                      error={errorInput.course_signup_time}
                      name="course_signup_time"
                      label="Available for signup"
                      value={courseData.course_signup_time}
                      onChange={(e) =>
                          setCourseData({
                              ...courseData,
                              course_signup_time: e,
                          })
                      }
                      renderInput={(params) => (
                          <TextField required InputLabelProps={{ style: { fontSize: 13 } }} size='small' fullWidth variant="outlined" {...params} />
                      )}
                  />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                      inputProps={{ style: { fontSize: 13 } }}
                      InputLabelProps={{ style: { fontSize: 13 } }}
                      error={errorInput.quit_deadline}
                      name="quit_deadline"
                      label="Deadline for quitting"
                      value={courseData.quit_deadline}
                      onChange={(e) =>
                          setCourseData({
                              ...courseData,
                              quit_deadline: e,
                          })
                      }
                      renderInput={(params) => (
                          <TextField InputLabelProps={{ style: { fontSize: 13 } }} required size='small' fullWidth variant="outlined" {...params} />
                      )}
                  />
              </LocalizationProvider>
              <Grid container spacing={1} style={{marginTop: 1}}>
                <Grid item xs={6}>
                  <LoadingButton
                      loading={ isLoading || isUpdatingCourse || isCreatingCourse }
                      disabled={validate()}
                      className={classes.buttonSubmit}
                      variant="contained"
                      color="primary"
                      size="small"
                      type="submit"
                      fullWidth
                  >
                      Submit
                  </LoadingButton>
                </Grid>
                <Grid item xs={6}>
                  <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      fullWidth
                      onClick={clear}
                  >
                      Clear
                  </Button>
                </Grid>
              </Grid>
          </form>
      </Paper>
  );
}

export default Form;