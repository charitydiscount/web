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

    async componentDidMount() {
        try {
            let response = await fetchCauses();
            if (response) {
                this.setState({
                    causes: response as CauseDto[],
                    isLoading: false
                })
            }
        } catch (error) {
            //causes not loaded
        }

        store.dispatch(NavigationsAction.setStageAction(Stages.CAUSES));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CAUSES));
    }

    public render() {
        const causesList = this.state.causes ? this.state.causes.map(cause => {
            return <Cause key={cause.id} cause={cause}/>
        }) : null;

        return (
            <React.Fragment>
                <FadeLoader
                    loading={this.state.isLoading}
                    color={'#1641ff'}
                    css={spinnerCss}
                />
                {!this.state.isLoading &&
                <div className="container">
                    <section className="hot_deals_area section_gap">
                        <div className="container-fluid">
                            <div className="row">
                                {causesList}
                            </div>
                        </div>
                    </section>
                </div>
                }
            </React.Fragment>
        )
    }
}

export default Causes;

