import * as actionType from '../constants/actionTypes';
import * as api from '../api/index.js';



export const signin = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING_AUTH})
    const { data } = await api.signIn(formData);
    const result = data.result;
    const token = data.token;
  
    dispatch({ type: actionType.AUTH, payload: { result, token} });
    
    dispatch({ type: actionType.END_LOADING_AUTH})
    history.push('/');
  } catch (error) {
    dispatch({ type: actionType.WRONG, payload: 'Email or Password is wrong' });
    console.log(error);
    dispatch({ type: actionType.END_LOADING_AUTH}) 
  }
};

export const signup = (formData, history) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING_AUTH})
    const { data } = await api.signUp(formData);
    const result = data.result;
    const token = data.token;

    
    dispatch({ type: actionType.AUTH, payload: { result, token } });
    dispatch({ type: actionType.END_LOADING_AUTH})
    history.push('/');
  } catch (error) {
    dispatch({ type: actionType.WRONG, payload: 'User already exists' })
    console.log(error);
    dispatch({ type: actionType.END_LOADING_AUTH})
  }
};


export const recover = (email) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING_AUTH})
    const { data } = await api.recover(email);
    dispatch({ type: actionType.END_LOADING_AUTH})
    const message = data.message;
    dispatch({ type: actionType.RECOVER, payload: { message } });
    
  } catch (error) {
    console.log(error);
    dispatch({ type: actionType.END_LOADING_AUTH})
  }
};

export const resetpassword = (newPassword, token) => async (dispatch) => {
  try {
    dispatch({ type: actionType.START_LOADING_AUTH})
    const { data } = await api.resetpassword(newPassword, token);
    dispatch({ type: actionType.END_LOADING_AUTH})
    const message = data.message;
    dispatch({ type: actionType.RESETPW, payload: { message } });
    
  } catch (error) {
    dispatch({ type: actionType.FAILPWRESET, payload: 'This link is either expired or invalid.' });
    console.log(error);
    dispatch({ type: actionType.END_LOADING_AUTH})
  }
};

export const getUsers = () => async(dispatch) => {
    
  try {
      dispatch({ type: actionType.START_LOADING_FETCH_ALL_USERS})
      const { data } = await api.fetchUsers();

      dispatch({ type: actionType.FETCH_ALL_USERS, payload: data})
      dispatch({ type: actionType.END_LOADING_FETCH_ALL_USERS})
  } catch (error) {
      console.log(error)
      dispatch({ type: actionType.END_LOADING_AUTH})
  }    
}

export const updateUser = (userdata) => async(dispatch) => {
    
  try {
      dispatch({ type: actionType.START_LOADING_UPDATE_USER})

      const { data } = await api.updateUser(userdata);
      dispatch({ type: actionType.UPDATE_USER, payload: data });
      dispatch({ type: actionType.END_LOADING_UPDATE_USER})

  } catch (error) {
      console.log(error)
      dispatch({ type: actionType.END_LOADING_AUTH})
  }    
} 