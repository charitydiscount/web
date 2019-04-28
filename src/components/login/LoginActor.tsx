import * as React from "react";
import {store} from "../../index";
import {Stages} from "../helper/Stages";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import Login from "./LoginComponent";

class LoginActor extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.EMPTY));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.EMPTY));
    }

    public render() {
        return (
            <Login/>
        )
    }
}

export default LoginActor;