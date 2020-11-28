import * as actionTypes from './actionTypes';
import axios from 'axios';
import {apiKey} from './config';

export const authStart =() =>{
    return {
        type:actionTypes.AUTH_START
    };
};

export const authSuccess = (token,userId) =>{
    return {
        type:actionTypes.AUTH_SUCCESS,
        idToken:token,
        userId:userId
    };
};

export const authFail = (error) =>{
    return {
        type:actionTypes.AUTH_FAIL,
        error:error
    };
};

export const logout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type:actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) =>{
    return dispatch=> {
        setTimeout(()=>{
            dispatch(logout());
        },expirationTime * 1000)

    };
};

export const auth = (email,password,isSignup)=>{
    return dispatch =>{
        dispatch(authStart());
        const authData = {
            email:email,//defined by firebase restAPI
            password:password,//defined by firebase restAPI
            returnSecureToken:true,//defined by firebase restAPI
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ apiKey;
        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ apiKey;
        }
        axios.post(url,authData)
            .then(response =>{
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token',response.data.idToken);//tokenをブラウザに保存
                localStorage.setItem('expirationDate',expirationDate);//使用期限を保持
                localStorage.setItem('userId',response.data.localId);//idを保持
                dispatch(authSuccess(response.data.idToken,response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err =>{

                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) =>{
    return {
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path:path
    };
};

export const authCheckState = () =>{//reloadingでもauth状態をstorageから取得する
    return dispatch =>{
        const token = localStorage.getItem('token');
        if(!token){//not auth
            dispatch(logout());
        }else{// is auth
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){//expired
                dispatch(logout());
            }else{ //not expired
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token,userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/ 1000));

            }
        }
    }
}