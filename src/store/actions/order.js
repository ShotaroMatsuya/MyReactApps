//define action creator
import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const  purchaseBurgerSuccess = (id,orderData) =>{
    return {
        type:actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId:id,
        orderData:orderData
    };

};

export const purchaseBurgerFail = (error) =>{
    return {
        type:actionTypes.PURCHASE_BURGER_FAIL,
        error:error
    };
};

export const purchaseBurgerStart = () =>{//loadingの開始
    return {
        type:actionTypes.PURCHASE_BURGER_START,
    };
};

export const purchaseBurger = (orderData) =>{//asyncコードの実行時はfunctionをreturn
    return dispatch =>{
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json',orderData)//orderDataはobject
            .then(response=>{
                console.log(response);
                dispatch(purchaseBurgerSuccess(response.data.name,orderData));//response.data.nameにidが渡っている
            })
            .catch(error =>{
                dispatch(purchaseBurgerFail(error));
            });
    };
};