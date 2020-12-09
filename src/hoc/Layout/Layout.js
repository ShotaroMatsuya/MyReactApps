import React, { useState } from 'react';
import Aux from '../Aux/Aux';
import { connect } from 'react-redux';

import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const layout = props => {
  // state ={
  //     showSideDrawer:false
  // }
  const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);
  const sideDrawerClosedHandler = () => {
    // this.setState({showSideDrawer:false});
    setSideDrawerIsVisible(false);
  };
  const sideDrawerToggleHandler = () => {
    // this.setState({showSideDrawer:!this.state.showSideDrawer});
    //setStateはasynchronousなので引数をコールバックで
    // this.setState((prevState)=>{
    //     return {showSideDrawer:!prevState.showSideDrawer};
    // });
    setSideDrawerIsVisible(!sideDrawerIsVisible);
  };

  return (
    <Aux>
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        isAuth={props.isAuthenticated}
        open={sideDrawerIsVisible}
        closed={sideDrawerClosedHandler}
      />
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
};
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(layout);
