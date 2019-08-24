import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";

class Wallet extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.WALLET));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.WALLET));
    }

    public render() {
        return (
            <React.Fragment>
                <section className={"product_description_area"}>
                    <div className={"container"}>
                        <div className={"tab-content"}>
                            <div className="tab-pane fade show active" id="review" role="tabpanel"
                                 aria-labelledby="review-tab">
                                <div className="row">
                                    <div className="col-4 total_rate">
                                        <div className="box_total">
                                            <h5>Cashback</h5>
                                            <h4>4.0</h4>
                                            <h6>Pending:112.4</h6>
                                        </div>
                                    </div>
                                    <div className="col-4 total_rate">
                                        <div className="box_total">
                                            <h5>Charity points</h5>
                                            <h4>4.0</h4>
                                            <h6>Pending:112.4</h6>
                                        </div>
                                    </div>
                                    <div className="col-4 total_rate">
                                        <div className="box_total">
                                            <h5>Transactions</h5>
                                            <h4>11</h4>
                                            <h6>Pending:112</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default Wallet;


