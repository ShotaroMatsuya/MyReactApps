import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props)=>{
    //1.Object.keys()メソッドでオブジェクトのキーのみを取得しarrayに変換
    //2.Array()メソッドは引数に指定した数字だけarray内に要素(undefined)を作る
    //3.reduce()メソッド内のコールバックには第一引数に処理されたあとの配列要素、第２引数に現在処理する配列要素が渡る。第２引数にはinitial valueをセット
    //ここでは二元配列を一元配列に変換するために使用している[[..],[..],..]→[..,..,..]
    let transformedIngredients = Object.keys(props.ingredients).map(igKey=>{
        return [...Array(props.ingredients[igKey])].map((_,i)=>{
            return <BurgerIngredient key={igKey + i} type={igKey} />;
        });
    })
    .reduce((arr,el)=>{
        return arr.concat(el);
    },[]);
    console.log(transformedIngredients);
    if(transformedIngredients.length === 0){
        transformedIngredients =<p>Please start adding ingredients!</p>;
    }
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;