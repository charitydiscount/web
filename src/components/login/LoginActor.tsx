import * as React from 'react';
import {auth, store} from '../../index';
import {Stages} from '../helper/Stages';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import Login from './LoginComponent';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {Routes} from '../helper/Routes';
import {UserActions} from "./UserActions";

interface ILoginRendererProps {
    isUserLogged: boolean;
}

class LoginActor extends React.Component<ILoginRendererProps> {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.EMPTY));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.EMPTY));
    }

    public render() {
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
