import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '0px 0px 0px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 10px',
    maxHeight: 44,
    
  },
  heading: {
    color: 'black',
    fontFamily: 'Black Ops One',
    textDecoration: 'none',
  },
  image: {
    marginLeft: '15px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '400px',
    padding: '0'
  },
  profile: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '10px'
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));