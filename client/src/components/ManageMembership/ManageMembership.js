import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../../actions/auth';
import UserTable from './UserTable/UserTable';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';


const ManageMembership = ({socket}) => {
    
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(getUsers())
    },[dispatch])

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

    const users = useSelector((state)=> state.auth.users)

    const [ q, setQ ] = useState('')

    const searchEmail = (rows) => {
        return rows.filter(row => row.user_email.toLowerCase().indexOf(q.toLowerCase()) > -1);
    }

    return (
        <>
            <Paper style={{marginTop: 15, padding: 10}}>
                <TextField 
                    fullWidth
                    size="small"
                    label="Type email here" 
                    variant="outlined"
                    value={q}
                    onChange={(e) => setQ(e.target.value)} 


                />
            </Paper>
            <div style={{marginTop: 15, }}>
                <UserTable socket={socket} users={searchEmail(users)} />
            </div>
        </>
    )
}

export default ManageMembership
