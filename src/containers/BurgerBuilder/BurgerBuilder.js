import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const burgerBuilder = props => {
  // state = {
  //     // purchasable:false,//Orderボタンの表示
  //     purchasing:false,//modalの表示
  //     // loading:false,//spinnerの表示
  //     // error:false//error時のspinner表示
  // };

  const [purchasing, setPurchasing] = useState(false);

  //react-redux7以上で使えるuseSelectorとuseDispatch
  const ings = useSelector(state => {
    //現在のstate
    return state.burgerBuilder.ingredients;
  });
  const price = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => state.burgerBuilder.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  const dispatch = useDispatch();

  const onIngredientAdded = ingName => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = ingName =>
    dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path =>
    dispatch(actions.setAuthRedirectPath(path));

  // componentDidMount(){
  //     this.props.onInitIngredients();
  // }
  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);
  const updatePurchaseState = ingredients => {
    //order-btnのactivate

    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        //個数を全部足す(返り値はarrayではなくinteger)
        return sum + el;
      }, 0);
    return sum > 0;
    // this.setState({purchasable:sum > 0});
  };
  // addIngredientHandler=(type)=>{//incrementボタン
  //     const oldCount = this.state.ingredients[type];
  //     const updatedCount = oldCount + 1;
  //     const updatedIngredients ={
  //         ...this.state.ingredients
  //     };
  //     updatedIngredients[type] = updatedCount;
  //     const priceAddition = INGREDIENT_PRICES[type];
  //     const oldPrice = this.state.totalPrice;
  //     const newPrice = oldPrice + priceAddition;
  //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
  //     this.updatePurchaseState(updatedIngredients);//updateされたばかりのstateを反映させるために引数で渡す必要がある

  // }
  // removeIngredientHandler=(type)=>{//decrementボタン
  //     const oldCount = this.state.ingredients[type];
  //     if(oldCount<=0){
  //         return ;

  //     }
  //     const updatedCount = oldCount - 1;
  //     const updatedIngredients ={
  //         ...this.state.ingredients
  //     };
  //     updatedIngredients[type] = updatedCount;
  //     const priceDeduction = INGREDIENT_PRICES[type];
  //     const oldPrice = this.state.totalPrice;
  //     const newPrice = oldPrice - priceDeduction;
  //     this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
  //     this.updatePurchaseState(updatedIngredients);//updateされたばかりのstateを反映させるために引数で渡す必要がある

  // }
  // purchaseHandler(){
  //     //eventHandlerにてthisを使うときはthisがインスタンスを指し示さないことがある。
  //     //その場合にはarrow-functionで書けばOK
  //     this.setState({purchasing:true});
  // }
  const purchaseHandler = () => {
    //modal表示
    if (isAuthenticated) {
      // this.setState({purchasing:true});
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout'); //auth後にredirectするpathを指定
      props.history.push('/auth');
    }
  };
  const purchaseCancelHandler = () => {
    //modal非表示
    // this.setState({purchasing:false});
    setPurchasing(false);
  };
  const purchaseContinueHandler = () => {
    //orderページへingredients情報を渡しredirect
    // //alert('You continue!');

    // //今回はpropsではなく、URLクエリパラメータで情報を受け渡してみる
    // const queryParams = [];
    // for(let i in this.state.ingredients){//ingredientsはObject
    //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    // }
    // //totalPriceをcontactDataまで渡す必要がある
    // queryParams.push('price='+ this.state.totalPrice);
    // const queryString = queryParams.join('&');//URLクエリパラメータの作成
    // this.props.history.push({
    //     pathname:'/checkout',
    //     search:'?'+ queryString
    // });

    //reduxで受け渡すのでquery-parameterを使用する必要がなくなった
    onInitPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = {
    ...ings,
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  //{salad:true,meat:false,..}
  let orderSummary = null;

  let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
  if (ings) {
    burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          purchasable={updatePurchaseState(ings)} //renderingされるたびに実行される
          ordered={purchaseHandler}
          isAuth={isAuthenticated}
          price={price}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ings}
        price={price}
        purchaseCanceled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};
// const mapStateToProps = state => {
//   return {
//     ings: state.burgerBuilder.ingredients,
//     price: state.burgerBuilder.totalPrice,
//     error: state.burgerBuilder.error,
//     isAuthenticated: state.auth.token !== null,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
//     onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
//     onInitIngredients: () => dispatch(actions.initIngredients()),
//     onInitPurchase: () => dispatch(actions.purchaseInit()),
//     onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path)),
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withErrorHandler(burgerBuilder, axios));
export default withErrorHandler(burgerBuilder, axios);
