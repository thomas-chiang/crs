import React from 'react';
import Course from './Course/Course';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress, Paper, Typography } from '@material-ui/core';


const Courses = ({ setCourseEditId, setCourseCopyId, courseEditId, socket }) => {

  const { isMyCourses } = useSelector((state) => state.courses)
  const { courses, isLoading } = useSelector((state) => state.courses)
  const user = JSON.parse(localStorage.getItem('profile'))
  const { courseUsers } = useSelector((state) => state.courseUsers)
  
  const  courseUsersOfCurrentUser  = courseUsers.filter((cu)=> cu.user_id === user?.result.user_id )
  
  const myCourses = courses.filter(course => new Date(course.course_time).getTime() > new Date(Date.now() - (3600 * 1000 * 24)).getTime() && courseUsersOfCurrentUser.find( cu => cu.course_id === course.course_id))
  
  const filterCourses = courses.filter(course => new Date(course.course_time).getTime() > new Date(Date.now() - (3600 * 1000 * 24)).getTime())
  
  const sortedCourses = filterCourses.sort(function (x, y) {
    return new Date(x.course_time).getTime() - new Date(y.course_time).getTime();
  }) 

  const mySortedCourses = myCourses.sort(function (x, y) {
    return new Date(x.course_time).getTime() - new Date(y.course_time).getTime();
  }) 

  if(!courses.length && !isLoading) {
    return (
      <Paper>
        <Typography variant='h6' align="center"> 
          No courses found
        </Typography>
      </Paper>
    )
  } else if (!user) {
    return (
      <Paper>
        <Typography variant='h6' align="center"> 
          Please sign in 
        </Typography>
      </Paper>
    )
  }

  return (
    isLoading ? (
      <>
      <CircularProgress />
      </>
      ) : (
      <Grid container justifyContent="space-evenly" spacing={2} /* direction={"column"} style={{height: '800px'}} */>
        {isMyCourses ? (
          mySortedCourses.map((course) => (
            <Grid key={course.course_id} item style={{width: '165px'}}>
              <Course socket={socket} course={course} setCourseEditId={setCourseEditId} setCourseCopyId={setCourseCopyId}/>
            </Grid>
          ))
        ) : (
          sortedCourses.map((course) => (
            <Grid key={course.course_id} item style={{width: '165px'}}>
              <Course socket={socket} course={course} courseEditId={courseEditId} setCourseEditId={setCourseEditId} setCourseCopyId={setCourseCopyId}/>
            </Grid>
          ))
        )}
        
      </Grid>
    )
  );
}

export default Courses;