import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems =(props)=>(
    <ul className={classes.NavigationItems}>
        {/* exact propsを渡すことでactiveクラスが常に追加されないようにする */}
       <NavigationItem link="/" exact>Burger Builder</NavigationItem>
       <NavigationItem link="/orders">Orders</NavigationItem>
       <NavigationItem link="/auth">Auth</NavigationItem>
    </ul>
);

export default navigationItems;