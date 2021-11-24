import React from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { deleteCourseUser } from "../../../../../actions/courseUser";
import { useDispatch } from "react-redux";

import { useSelector } from 'react-redux';



const Participant = ({ course, courseUser, socket }) => {

    const { loadingCourseIdsByCoach, loadingUserIdsByCoach } = useSelector((state) => state.courseUsers)
    const coach = JSON.parse(localStorage.getItem('profile'))?.result.position;
    const dispatch = useDispatch();
    const course_id = course.course_id;
    const user_id = courseUser.user_id;


    const courseUserToDelete = {
        user_id,
        course_id,
        coach
    };


    return (
        <Paper square style={{ margin: '10px', display: 'flex', justifyContent: 'space-between'}} key={courseUser.user_id}> 
            <Typography 
                variant="caption" 
                style={{ 
                    marginLeft: '10px', 
                    marginRight: '10px',
                    color: courseUser.is_waiting ? 'orange' : 'blue'
                }}
            >
               {courseUser.user_name}
            </Typography>
            {coach && 
            <LoadingButton
                loading={loadingCourseIdsByCoach.includes(course_id) && loadingUserIdsByCoach.includes(user_id)}
                style={{ MaxWidth: '10px', height: '15px' }}
                onClick={() => {
                    dispatch(deleteCourseUser(courseUserToDelete))
                    socket.emit('changeCourseUsers', {
                        socketId: socket.id 
                    })
                }}
            >
                {!(loadingCourseIdsByCoach.includes(course_id) && loadingUserIdsByCoach.includes(user_id)) &&
                <PersonOffIcon style={{ fontSize: '15px'}} />
                }   
            </LoadingButton>
            }
            
        </Paper>
    )
}

export default Participant;