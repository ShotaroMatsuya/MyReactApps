import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';


import ContactData from './ContactData/ContactData';

class Checkout extends Component{
    // componentWillMount(){//クエリパラメータを取得
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};//最終的にobjectにする
    //     let price = 0;
    //     for (let param of query.entries()){
    //         //query.entriesメソッドはsearchクエリからarrayを作成　例：['salad','1']
    //         if(param[0] === 'price'){
    //             price =  param[1];
    //         }else{
    //             ingredients[param[0]] = +param[1]; //Number型にする

    //         }
    //     }
    //     this.setState({ingredients:ingredients,totalPrice : price});
    // }
    checkoutCancelledHandler = () =>{
        this.props.history.goBack();
    }
    checkoutContinuedHandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        let summary = <Redirect to="/" />;
        if(this.props.ings){
            summary =(
                <div>
                    <CheckoutSummary 
                        ingredients={this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler} />
                        {/* ↓これだとpropsをContactDataコンポーネントに渡せない */}
                        {/* <Route path={this.props.match.path + '/contact-data'} component={ContactData} /> */}
                    <Route 
                        path={this.props.match.path + '/contact-data'} 
                        // render={(props)=>(<ContactData ingredients={this.props.ings} price={this.state.totalPrice} {...props}/>)}
                        component={ContactData}//reduxでstate管理しているのでpropsで渡す必要なし
                            />
                        {/* Routeのhistoryオブジェクト使用するためpropsを引き継ぐ */}

                </div>
            );
        }
        return summary;
    }
}

const mapStateToProps = state =>{
    return {
        ings:state.burgerBuilder.ingredients
    };
}

export default connect(mapStateToProps)(Checkout);