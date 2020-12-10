import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    // // state = {
    // //     error:null
    // // };
    // const [error, setError] = useState(null);

    // // constructor(props){//componentが表示されるたびに毎度実行されるため何度もinterceptorsがregisterされてしまい、負荷増大の要因になるのでclean upする必要がある
    // //     super(props);
    // //     this.reqInterceptor = axios.interceptors.request.use(req=>{//request送るたびにerrorをクリアリング
    // //         this.setState({error:null});
    // //         return req;
    // //     });
    // //     this.resInterceptor = axios.interceptors.response.use(res => res,error =>{
    // //         this.setState({error:error});
    // //     });
    // // }
    // //functional componentでconstructorと同様の動きをつけるには、そのまま関数として実行するだけ
    // const reqInterceptor = axios.interceptors.request.use(req => {
    //   setError(null);
    //   return req;
    // });
    // const resInterceptor = axios.interceptors.response.use(
    //   res => res,
    //   err => {
    //     setError(err);
    //   }
    // );

    // // componentWillUnmount(){//unmountされたときにinterceptorsをcleanupするのがbest-practice
    // //     // console.log('Will Unmount', this.reqInterceptor,this.resInterceptor);
    // //     axios.interceptors.request.eject(this.reqInterceptor);
    // //     axios.interceptors.response.eject(this.resInterceptor);
    // // }

    // //componentWillUnmountはuseEffectのクリーンナップ関数として定義
    // //第2引数をempty arrayにすると、mainFがcomponentDidMount時に実行、clearFがcomponentUnmount時に実行
    // useEffect(() => {
    //   return () => {
    //     axios.interceptors.request.eject(reqInterceptor);
    //     axios.interceptors.response.eject(resInterceptor);
    //   };
    // }, [reqInterceptor, resInterceptor]);

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
    // errorConfirmedHandler = () => {
    //   this.setState({ error: null });
    // };
    // const errorConfirmedHandler = () => {
    //   setError(null);
    // };
    const [error, clearError] = useHttpErrorHandler(axios);
    return (
      <Aux>
        <Modal show={error} modalClosed={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
};

export default withErrorHandler;
