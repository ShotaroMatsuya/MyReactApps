import React from 'react';

//webpackでバンドルしたときに画像参照させるために下記のように画像ファイルのpathをセットする必要がある
import burgerLogo from '../../assets/Images/burger-logo.png';
import classes from './Logo.css';

const logo = (props)=>(
    <div className={classes.Logo} style={{height:props.height}}>
        <img src={burgerLogo} alt="MyBurger"/>
    </div>
);

export default logo;