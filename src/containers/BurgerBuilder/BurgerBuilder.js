import React,{Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BurgerControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';


class BurgerBuilder extends Component{

    state = {
        // purchasable:false,//Orderボタンの表示
        purchasing:false,//modalの表示
        // loading:false,//spinnerの表示
        // error:false//error時のspinner表示
    };
  
    componentDidMount(){
        console.log(this.props);
        this.props.onInitIngredients();
    }
    updatePurchaseState(ingredients){//order-btnのactivate

        const sum = Object.keys(ingredients).map(igKey=>{
            return ingredients[igKey];
        }).reduce((sum,el)=>{ //個数を全部足す(返り値はarrayではなくinteger)
            return sum + el;
        },0);
        return sum > 0;
        // this.setState({purchasable:sum > 0});
    }
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
    purchaseHandler=()=>{//modal表示
        this.setState({purchasing:true});
    }
    purchaseCancelHandler=()=>{//modal非表示
        this.setState({purchasing:false});
    }
    purchaseContinueHandler=()=>{//orderページへingredients情報を渡しredirect
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
        this.props.onInitPurchase();
        this.props.history.push('/checkout');

    }
    render(){
        const disabledInfo ={
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        //{salad:true,meat:false,..}
        let orderSummary = null;
    
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> :<Spinner />;
        if(this.props.ings){
            burger = (
            <Aux>
                <Burger ingredients={this.props.ings} />
                <BurgerControls 
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}//renderingされるたびに実行される
                    ordered={this.purchaseHandler}
                    price={this.props.price}/>
            </Aux>);
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        error:state.burgerBuilder.error
    };
}

const mapDispatchToProps = dispatch =>{
    return {
        onIngredientAdded: (ingName)=>dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName)=>dispatch(actions.removeIngredient(ingName)),
        onInitIngredients:()=>dispatch(actions.initIngredients()),
        onInitPurchase: ()=>dispatch(actions.purchaseInit())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));
