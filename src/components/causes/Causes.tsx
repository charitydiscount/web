import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Cause from "./Cause";
import {CauseDto, fetchCauses} from "../../rest/CauseService";
import FadeLoader from 'react-spinners/FadeLoader';
import {spinnerCss} from "../../helper/AppHelper";

interface ICausesProps {
}

interface ICausesState {
    causes: CauseDto[],
    isLoading: boolean
}


class Causes extends React.Component<ICausesProps, ICausesState> {

    constructor(props: ICausesProps) {
        super(props);
        this.state = {
            causes: [],
            isLoading: true
        };
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CAUSES));
        fetchCauses(this);
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CAUSES));
    }

    public render() {
        const causesList = this.state.causes ? this.state.causes.map(cause => {
            return <Cause key={cause.details.title} description={cause.details.description}
                          images={cause.details.images}
                          site={cause.details.site} title={cause.details.title}/>
        }) : null;

        return (
            <React.Fragment>
                <FadeLoader
                    loading={this.state.isLoading}
                    color={'#1641ff'}
                    css={spinnerCss}
                />
                {!this.state.isLoading &&
                    <div className="container p_120">
                        {causesList}
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default Causes;

