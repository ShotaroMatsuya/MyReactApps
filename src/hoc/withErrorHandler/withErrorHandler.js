import React,{Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) =>{
    
    return class extends Component{
        state = {
            error:null
        };
        constructor(props){//componentが表示されるたびに毎度実行されるため何度もinterceptorsがregisterされてしまい、負荷増大の要因になるのでclean upする必要がある
            super(props);
            this.reqInterceptor = axios.interceptors.request.use(req=>{//request送るたびにerrorをクリアリング
                this.setState({error:null});
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res => res,error =>{
                this.setState({error:error});
            });
        }
        componentWillUnmount(){//unmountされたときにinterceptorsをcleanupするのがbest-practice
            // console.log('Will Unmount', this.reqInterceptor,this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }
        //componentDidMountはラップしたコンポーネントのすべてのchildComponentが読み込まれたあとに初めて呼び出されるメソッドなのでinterceptorsを呼び出すのにはconstructorが適している
        // componentDidMount(){
        //     axios.interceptors.request.use(req=>{//request送るたびにerrorをクリアリング
        //         this.setState({error:null});
        //         return req;
        //     });
        //     axios.interceptors.response.use(res => res,error =>{
        //         this.setState({error:error});
        //     });
        // }
        errorConfirmedHandler=()=>{
            this.setState({error:null});
        }
        render(){
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}
                        >
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );

        }
    }
}

export default withErrorHandler;