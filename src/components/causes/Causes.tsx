import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Cause from "./Cause";

class Causes extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CAUSES));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CAUSES));
    }

    public render() {
        return (
            <React.Fragment>
                    <div className="container p_120">
                        <Cause/>
                        <Cause/>
                        <Cause/>
                        <Cause/>
                        <Cause/>
                        <Cause/>
                    </div>
            </React.Fragment>
        )
    }
}

export default Causes;

