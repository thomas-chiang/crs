import React, { useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';


import LoadingButton from '@mui/lab/LoadingButton';
import { updateUser } from '../../../actions/auth';
import { useDispatch, useSelector} from 'react-redux';

const UserTable = ({ users, socket }) => {

    const { isLoadingFetchAllUsers, isLoadingUpdateUser } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const [userEmail, setUserEmail] = useState(null)

    if(isLoadingFetchAllUsers) {
        return (
            <CircularProgress />
        )
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} size="small" >
                <TableHead>
                    <TableRow>                        
                        <TableCell>Email</TableCell>
                        <TableCell>Activation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(row => <TableRow key={row.user_email}>
                        <TableCell>{row.user_email}</TableCell>
                        <TableCell>{
                            <LoadingButton 
                                loading={isLoadingUpdateUser && userEmail===row.user_email}
                                size='small'
                                variant='contained'
                                color={row.is_activated ? 'secondary' : 'primary' }
                                onClick={()=>{
                                    setUserEmail(row.user_email)
                                    dispatch(updateUser({
                                        user_email: row.user_email,
                                        is_activated: !row.is_activated
                                    }))
                                    socket.emit('changeUsers', {
                                        socketId: socket.id
                                    })
                                }}
                            >
                                {row.is_activated ? 'deactivate' : 'activate' }
                            </LoadingButton>
                        }</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default UserTable
