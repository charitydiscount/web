import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import WalletBlock from "./WalletBlock";
import {fetchWalletInfo, TransactionDto} from "../../rest/WalletService";
import WalletTableRow from "./WalletTableRow";

interface IWalletProps {

}

interface IWalletState {
    cashbackApproved: number,
    cashbackPending: number,
    pointsApproved: number,
    pointsPending: number,
    totalTransactions: number,
    transactions: TransactionDto[]
}

class Wallet extends React.Component<IWalletProps, IWalletState> {

    constructor(props: IWalletProps) {
        super(props);
        this.state = {
            cashbackApproved: 0,
            cashbackPending: 0,
            pointsApproved: 0,
            pointsPending: 0,
            totalTransactions: 0,
            transactions: []
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
        const transactionsHistory = this.state.transactions ? this.state.transactions.map(value => {
            return <WalletTableRow date={value.createdAt.toDate().toDateString()} type={value.type} amount={value.amount} target={value.target}/>
        }) : null;


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
                                                 pendingExists={false}/>
                                    <WalletBlock title={"Transactions"} approved={this.state.totalTransactions}
                                                 pendingExists={false}/>
                                </div>
                            </div>
                        </div>

                        <div className={"tab-content"}>
                            <h3 className="mb-30 title_color">Comissions History</h3>
                            <div className="progress-table-wrap">
                                <div className="progress-table">
                                    <div className="table-head">
                                        <div className="country">Date</div>
                                        <div className="country">Type</div>
                                        <div className="country">Amount</div>
                                        <div className="country">Target</div>
                                    </div>
                                    {transactionsHistory}
                                </div>
                            </div>
                        </div>

                        <div className={"tab-content"}>
                            <h3 className="mb-30 title_color">Transaction History</h3>
                            <div className="progress-table-wrap">
                                <div className="progress-table">
                                    <div className="table-head">
                                        <div className="country">Date</div>
                                        <div className="country">Amount</div>
                                        <div className="country">Type</div>
                                        <div className="country">Target</div>
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


