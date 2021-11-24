import React, { useState } from "react";
import useStyles from "./styles";
import { Card, CardActions, Button, Typography, Grid } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch } from "react-redux";
import { deleteCourse } from "../../../actions/courses";
import { createCourseUser, deleteCourseUser} from "../../../actions/courseUser";
import { useSelector } from "react-redux";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SportsIcon from '@mui/icons-material/Sports';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Participants from "./Participants/Participants";
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';




const Course = ({course, setCourseEditId, setCourseCopyId, courseEditId, socket}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const coach = JSON.parse(localStorage.getItem('profile'))?.result.position;
    const user_id = JSON.parse(localStorage.getItem("profile"))?.result.user_id;
    const user_name = JSON.parse(localStorage.getItem("profile"))?.result.user_name;
    const course_id = course.course_id;
    const isActivated = useSelector((state)=> state.auth.users).filter(user => user.user_id === user_id)[0]?.is_activated
    const [courseDeleteId, setCourseDeleteId] = useState(null)
    const { isUpdatingCourse, isDeletingCourse } = useSelector((state) => state.courses)
    const thisCourse = useSelector((state) => state.courses.courses.filter(course => course.course_id === course_id))[0];
    const thisCourseUsers = useSelector((state) => state.courseUsers.courseUsers.filter(courseUser => courseUser.course_id === course_id));
    const { loadingCourseIds } = useSelector((state) => state.courseUsers)
    
    const thisCourseUsersIsFull = thisCourseUsers.length >= course.course_capacity
    
    const thisCourseUser = thisCourseUsers.find(courseUser => courseUser.user_id === user_id )


    const courseUserToDelete = {
        user_id,
        course_id             
    };

    const courseUserToAdd = {
        user_id,
        course_id,
        user_name,          
    };

    
    if ( ( isUpdatingCourse || isDeletingCourse ) && (courseEditId === course_id || courseDeleteId === course_id) ) {
        return (
            <Card className={classes.card} style={{ alignItems: 'center', justifyContent: 'center', }}>
                <CircularProgress />
            </Card>
        )
    }
    

    return (
        <Card className={classes.card}>
            {isActivated && 
            <div className={classes.overlay2}>
                {thisCourseUser ? 
                    <LoadingButton 
                        loading={loadingCourseIds.includes(course_id)}
                        onClick={() => {
                            if(new Date(thisCourse.quit_deadline).getTime() > new Date().getTime()) {                          
                                dispatch(deleteCourseUser(courseUserToDelete))
                                socket.emit('changeCourseUsers', {
                                    socketId: socket.id
                                })
                            } else {
                                window.alert(`After ${new Date(thisCourse.quit_deadline).toLocaleDateString([],{ month: '2-digit', day: '2-digit' })} ${new Date(thisCourse.quit_deadline).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}, please contact your coach to drop the course`)
                            }
                        }}
                        style={{ textTransform: 'none' ,maxWidth: '30px', maxHeight: '30px', minWidth: '100%', minHeight: '100%'}}
                    >
                        { !loadingCourseIds.includes(course_id) && 
                            <PersonOffIcon style={{ color: thisCourseUser.is_waiting ? 'orange' : 'red', fontSize: '25px' }} />
                        }
                    </LoadingButton>  
                :   
                    <LoadingButton 
                        loading={loadingCourseIds.includes(course_id)}
                        onClick={() => {
                            if(new Date().getTime() > new Date(thisCourse.course_signup_time).getTime()) {   
                                dispatch(createCourseUser(courseUserToAdd))
                                socket.emit('changeCourseUsers', {
                                    socketId: socket.id
                                })
                            } else {
                                window.alert(`Please wait until ${new Date(thisCourse.course_signup_time).toLocaleDateString([],{ month: '2-digit', day: '2-digit' })} ${new Date(thisCourse.course_signup_time).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })} to sign up class`)
                            }
                        }}
                        style={{ textTransform: 'none' ,maxWidth: '30px', maxHeight: '30px', minWidth: '100%', minHeight: '100%'}}
                    >
                        { !loadingCourseIds.includes(course_id) && 
                            <PersonAddIcon style={{ color: thisCourseUsersIsFull ? 'orange' : 'blue', fontSize: '25px'}} />
                        }
                    </LoadingButton>    
                    
                }  
            </div>
            }  
            <div className={classes.overlay}>
                <Typography variant="h6" style={{wordWrap: "break-word", fontSize: 17, marginRight: '40px' }}>{thisCourse.course_name}</Typography>
                <Grid container>
                    <Grid item xs={2}>
                        <SportsIcon style={{ fontSize: '20px'}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">{thisCourse.coach} </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography align='right' variant="body2">{thisCourseUsers.length}/{thisCourse.course_capacity} </Typography>
                    </Grid>
                </Grid>
            </div>
           
            <div className={classes.details}>
                <Grid container spacing={0}>
                    <Grid item xs={2} > 
                        <ScheduleIcon style={{ color: "gray"  ,fontSize: '13px'}}/>
                    </Grid> 
                    <Grid item xs={10}>
                        <Typography variant="caption" color="textSecondary" component="h2" >                    
                        {new Date(thisCourse.course_time).toLocaleDateString([],{ month: '2-digit', day: '2-digit' })} 
                        <span> </span>
                        {new Date(thisCourse.course_time).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Grid>            
                </Grid>
            </div>
            <div className={classes.details}>
                <Grid container spacing={0}>
                    <Grid item xs={2} > 
                        <PersonAddIcon style={{ color: "gray"  ,fontSize: '13px'}}/>
                    </Grid> 
                    <Grid item xs={10}>
                        <Typography variant="caption" color="textSecondary" component="h2" >                    
                        {new Date(thisCourse.course_signup_time).toLocaleDateString([],{ month: '2-digit', day: '2-digit' })} 
                        <span> </span>
                        {new Date(thisCourse.course_signup_time).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Grid>            
                </Grid>
            </div>
            <div className={classes.details}>
                <Grid container spacing={0}>
                    <Grid item xs={2} > 
                        <PersonOffIcon style={{ color: "gray"  ,fontSize: '13px'}}/>
                    </Grid> 
                    <Grid item xs={10}>
                        <Typography variant="caption" color="textSecondary" component="h2" >                    
                        {new Date(thisCourse.quit_deadline).toLocaleDateString([],{ month: '2-digit', day: '2-digit' })} 
                        <span> </span>
                        {new Date(thisCourse.quit_deadline).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}
                        </Typography>  
                    </Grid>            
                </Grid>
            </div>



            {(isActivated || coach) &&
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <Participants socket={socket} course={course} thisCourseUsers={thisCourseUsers} />
            </div>
            }


            <CardActions className={classes.cardActions}>
                { coach && (
                <Button 
                    style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
                    size="small" color="primary" onClick={() => {setCourseEditId(thisCourse.course_id); setCourseCopyId(null);}} 
                >
                    <EditIcon fontSize="xs" /> 
                </Button>
                )}
               { coach && (
                <Button 
                    style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
                    size="small" color="primary" onClick={() => {setCourseCopyId(thisCourse.course_id); setCourseEditId(null);}} 
                >
                    <ContentCopyIcon fontSize="xs" /> 
                </Button>
                )}

                { coach && (
                <Button 
                    style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
                    size="small" color="primary" onClick={() => {
                        setCourseDeleteId(course_id)
                        dispatch(deleteCourse(thisCourse.course_id))
                        socket.emit('changeCourses', {
                            socketId: socket.id
                        })
                    } } 
                >
                    <DeleteIcon fontSize="xs" />
                </Button>
                )}
                
            </CardActions>
        </Card>
    );
};

export default Course;
