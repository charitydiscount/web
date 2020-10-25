import * as React from 'react';
import { store } from '../../index';
import { Stages } from '../helper/Stages';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import Login from './LoginComponent';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Routes } from '../helper/Routes';

interface ILoginRendererProps {
    isUserLogged: boolean;
}

class LoginActor extends React.Component<ILoginRendererProps> {

    componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.LOGIN));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.LOGIN));
    }

    public render() {
        return this.props.isUserLogged ? (
            <Redirect to={Routes.SHOPS}/>
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
