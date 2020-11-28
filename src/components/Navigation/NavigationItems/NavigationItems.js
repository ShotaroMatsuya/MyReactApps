import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems =(props)=>(
    <ul className={classes.NavigationItems}>
        {/* exact propsを渡すことでactiveクラスが常に追加されないようにする */}
       <NavigationItem link="/" exact>Burger Builder</NavigationItem>
       {props.isAuthenticated 
            ?<NavigationItem link="/orders">Orders</NavigationItem>
            :null}
       {!props.isAuthenticated 
            ? <NavigationItem link="/auth">Authenticate</NavigationItem>
            :<NavigationItem link="/logout">Logout</NavigationItem>
        }
       
    </ul>
);

export default navigationItems;