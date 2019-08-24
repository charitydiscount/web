import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import WalletBlock from "./WalletBlock";
import {fetchWalletInfo} from "../../rest/WalletService";

interface IWalletProps {
}

interface IWalletState {
    cashbackApproved: Number,
    cashbackPending: Number,
    pointsApproved: Number,
    pointsPending: Number,
    totalTransactions: Number
}

class Wallet extends React.Component<IWalletProps, IWalletState> {

    constructor(props: IWalletProps) {
        super(props);
        this.state = {
            cashbackApproved: 0,
            cashbackPending: 0,
            pointsApproved: 0,
            pointsPending: 0,
            totalTransactions: 0
        };
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.WALLET));
        fetchWalletInfo(this);
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
                                    <WalletBlock title={"Cashback"} approved={this.state.cashbackApproved}
                                                 pending={this.state.cashbackPending} pendingExists={true}/>
                                    <WalletBlock title={"Charity points"} approved={this.state.pointsApproved}
                                                 pending={this.state.pointsPending} pendingExists={true}/>
                                    <WalletBlock title={"Transactions"} approved={this.state.totalTransactions}
                                                 pendingExists={false}/>
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


