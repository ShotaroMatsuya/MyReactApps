import React, { Component } from 'react';

//lazy loading hoc
const asyncComponent = (importComponent) =>{
    return class extends Component{//return class component 引数には関数(import as function)を受け取る
        state = {
            component:null
        };
        componentDidMount(){
            importComponent()
                .then(cmp =>{
                    this.setState({component:cmp.default});
                });
        }
        render(){
            const C = this.state.component;
            return C ? <C {...this.props} /> : null;
        }
    }

}

export default asyncComponent;