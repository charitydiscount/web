import * as React from 'react';
import {auth, store} from '../../index';
import {Stages} from '../helper/Stages';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import Login from './LoginComponent';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {Routes} from '../helper/Routes';
import {clearStorage, removeLocalStorage} from "../../helper/StorageHelper";
import {StorageKey} from "../../helper/Constants";
import {UserActions} from "./UserActions";

interface ILoginRendererProps {
    isUserLogged: boolean;
}

class LoginActor extends React.Component<ILoginRendererProps> {

    async componentDidMount() {
        this.verifyUserLoggedInFirebase();
        store.dispatch(NavigationsAction.setStageAction(Stages.EMPTY));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.EMPTY));
    }

    public verifyUserLoggedInFirebase() {
        auth.onAuthStateChanged(function (user) {
            if (!user) {
                store.dispatch(UserActions.resetLoggedUserAction());
                removeLocalStorage(StorageKey.USER);
            }
        });
    }

    public render() {
        clearStorage();
        return this.props.isUserLogged ? (
            <Redirect to={Routes.CATEGORIES}/>
        ) : (
            <Login/>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        isUserLogged: state.user.isLoggedIn
    };
};
export default connect(mapStateToProps)(LoginActor);
