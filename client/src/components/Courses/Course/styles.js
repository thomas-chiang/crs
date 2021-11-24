import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  media: {
    height: 0,
    paddingTop: '56.25%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'darken',
  },
  border: {
    border: 'solid',
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    //justifyContent: 'space-between',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    //position: 'absolute',
    padding: '8px 0px 0px 16px',
    color: 'black',
  },
  overlay2: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    color: 'black',
  },
  grid: {
    display: 'flex',
  },
  details: {
    //display: 'flex',
    alignItems: 'end',
    padding: '0px 16px 3px 16px',
    
  },
  title: {
    padding: '0 16px',
  },
  cardActions: {
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
  },
});