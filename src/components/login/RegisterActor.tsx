import * as React from "react";
import {store} from "../../index";
import {Stages} from "../helper/Stages";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import Login from "./LoginComponent";

class RegisterActor extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REGISTER));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REGISTER));
    }

    public render() {
        return (
            <Login isLogin={false}/>
        )
    }
}

export default RegisterActor;