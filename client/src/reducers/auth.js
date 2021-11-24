import * as actionType from '../constants/actionTypes';

const authReducer = (
  state = { 
    authData: null, 
    users:[],
    isLoadingFetchAllUsers: false,
    isLoadingUpdateUser: false,
    isLoadingAuth: false
  }
  , 
  action) => {
    switch (action.type) {

      case actionType.START_LOADING_AUTH:
        return { ...state, isLoadingAuth: true }

      case actionType.END_LOADING_AUTH:
        return { ...state, isLoadingAuth: false }
      

      case actionType.FETCH_ALL_USERS:
        return {
          ...state,
          users: action.payload
        }

      case actionType.START_LOADING_FETCH_ALL_USERS:
        return { ...state, isLoadingFetchAllUsers: true }

      case actionType.END_LOADING_FETCH_ALL_USERS:
        return { ...state, isLoadingFetchAllUsers: false }

      case actionType.UPDATE_USER:
        return { ...state, users: state.users.map((user) => (user.user_email === action.payload.user_email  ? action.payload : user)) };

      case actionType.START_LOADING_UPDATE_USER:
        return { ...state, isLoadingUpdateUser: true }

      case actionType.END_LOADING_UPDATE_USER:
        return { ...state, isLoadingUpdateUser: false }

      case actionType.AUTH:   
        
        localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));

        return { ...state, authData: action?.payload };


      case actionType.LOGOUT:
        localStorage.clear();

        return { ...state, authData: null }; 

      case actionType.WRONG:
    
        return { ...state, authData: action?.payload };

      case actionType.RECOVER:
    
        return { ...state, authData: action?.payload };

      case actionType.RESETPW:
    
        return { ...state, authData: action?.payload };
      
      case actionType.FAILPWRESET:
    
        return { ...state, authData: action?.payload };

      default:
        return state;
    }
};

export default authReducer;
