import React,{Component} from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BurgerControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

// global constantsなので大文字
const INGREDIENT_PRICES ={
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon:0.7
};
class BurgerBuilder extends Component{

    state = {
        ingredients:null,
        totalPrice:4,//base price
        purchasable:false,//Orderボタンの表示
        purchasing:false,//modalの表示
        loading:false,//spinnerの表示
        error:false//error時のspinner表示
    };
  
    componentDidMount(){
        axios.get('https://react-my-burger-db68a.firebaseio.com/ingredients.json')
            .then(response=>{
                this.setState({ingredients:response.data});
            })
            .catch(err =>{
                this.setState({error:true});
            });
    }
    updatePurchaseState(ingredients){//order-btnのactivate

        const sum = Object.keys(ingredients).map(igKey=>{
            return ingredients[igKey];
        }).reduce((sum,el)=>{ //個数を全部足す(返り値はarrayではなくinteger)
            return sum + el;
        },0);
        this.setState({purchasable:sum > 0});
    }
    addIngredientHandler=(type)=>{//incrementボタン
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients ={
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);//updateされたばかりのstateを反映させるために引数で渡す必要がある

    }
    removeIngredientHandler=(type)=>{//decrementボタン
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){
            return ;

        }
        const updatedCount = oldCount - 1;
        const updatedIngredients ={
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);//updateされたばかりのstateを反映させるために引数で渡す必要がある

    }
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
        //alert('You continue!');
        
        //今回はpropsではなく、URLクエリパラメータで情報を受け渡してみる
        const queryParams = [];
        for(let i in this.state.ingredients){//ingredientsはObject
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        //totalPriceをcontactDataまで渡す必要がある
        queryParams.push('price='+ this.state.totalPrice);
        const queryString = queryParams.join('&');//URLクエリパラメータの作成
        this.props.history.push({
            pathname:'/checkout',
            search:'?'+ queryString
        });

    }
    render(){
        const disabledInfo ={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        //{salad:true,meat:false,..}
        let orderSummary = null;
    
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> :<Spinner />;
        if(this.state.ingredients){
            burger = (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BurgerControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}/>
            </Aux>);
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />;
        }
        if(this.state.loading){
            orderSummary = <Spinner />;
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

export default withErrorHandler(BurgerBuilder,axios);
