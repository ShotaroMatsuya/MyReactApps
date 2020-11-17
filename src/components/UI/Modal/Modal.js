import React, { Component } from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component{
    shouldComponentUpdate(nextProps,nextState){//Modalがprops.showがtrueのとき,or modalの内容に変更があたとき
        return nextProps.show !== this.props.show||nextProps.children !== this.props.children;
    }
    componentDIdUpdate(){
        console.log('[Modal] Did Update');
    }
    render(){
        return(
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
                <div 
                    className={classes.Modal}
                    style={{
                        transform:this.props.show ? 'translateY(0)':'translateY(-100vh)',
                        opacity:this.props.show ? '1':'0',
                    }}
                    >
                    {this.props.children}
                </div>
            </Aux>          
        );
    }
}

export default Modal;