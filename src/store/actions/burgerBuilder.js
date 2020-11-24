//define action creator

import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';


export const addIngredient = (name) =>{
    return {
        type:actionTypes.ADD_INGREDIENT,
        ingredientName:name
    };
};

export const removeIngredient = (name) =>{
    return {
        type:actionTypes.REMOVE_INGREDIENT,
        ingredientName:name
    };
};

export const setIngredients = (ingredients) =>{
    return {
        type:actionTypes.SET_INGREDIENTS,
        ingredients:ingredients
    };
};
export const fetchIngredientsFailed = () =>{
    return {
        type:actionTypes.FETCH_INGREDIENTS_FAILED,
    };
};

export const initIngredients = () =>{//asyncコードの実行時はfunctionをreturnする
    return dispatch =>{
        axios.get('https://react-my-burger-db68a.firebaseio.com/ingredients.json')
            .then(response=>{
                dispatch(setIngredients(response.data));
            })
            .catch(err =>{
                dispatch(fetchIngredientsFailed());
            });

    };
};