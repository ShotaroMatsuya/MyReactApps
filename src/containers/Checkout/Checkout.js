import React,{Component} from 'react';
import {Route} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';


import ContactData from './ContactData/ContactData';

class Checkout extends Component{
    state = {
        ingredients:null,
        totalPrice:0
    }
    componentWillMount(){//クエリパラメータを取得
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};//最終的にobjectにする
        let price = 0;
        for (let param of query.entries()){
            //query.entriesメソッドはsearchクエリからarrayを作成　例：['salad','1']
            if(param[0] === 'price'){
                price =  param[1];
            }else{
                ingredients[param[0]] = +param[1]; //Number型にする

            }
        }
        this.setState({ingredients:ingredients,totalPrice : price});
    }
    checkoutCancelledHandler = () =>{
        this.props.history.goBack();
    }
    checkoutContinuedHandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        return(
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
                    {/* ↓これだとpropsをContactDataコンポーネントに渡せない */}
                    {/* <Route path={this.props.match.path + '/contact-data'} component={ContactData} /> */}
                    <Route 
                        path={this.props.match.path + '/contact-data'} 
                        render={(props)=>(<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)} />
                        {/* Routeのhistoryオブジェクト使用するためpropsを引き継ぐ */}
            </div>
        );
    }
}
export default Checkout;