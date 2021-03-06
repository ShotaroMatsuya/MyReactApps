import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

import ContactData from './ContactData/ContactData';

const checkout = props => {
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

  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };
  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  };

  let summary = <Redirect to="/" />;
  if (props.ings) {
    //ingsがセットされていなかったらredirect
    const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null; //order確定したらredirect
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props.ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        {/* ↓これだとpropsをContactDataコンポーネントに渡せない */}
        {/* <Route path={this.props.match.path + '/contact-data'} component={ContactData} /> */}
        <Route
          path={props.match.path + '/contact-data'}
          // render={(props)=>(<ContactData ingredients={this.props.ings} price={this.state.totalPrice} {...props}/>)}
          component={ContactData} //reduxでstate管理しているのでpropsで渡す必要なし
        />
        {/* Routeのhistoryオブジェクト使用するためpropsを引き継ぐ */}
      </div>
    );
  }
  return summary;
};

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  };
};

export default connect(mapStateToProps)(checkout);
