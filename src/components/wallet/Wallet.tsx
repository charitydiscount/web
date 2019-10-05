import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import WalletBlock from "./WalletBlock";
import {CommissionDto, fetchCommissions, fetchWalletInfo, TransactionDto} from "../../rest/WalletService";
import WalletTransactionRow from "./WalletTransactionRow";
import {CommissionStatus, TxType} from "../../helper/Constants";
import WalletCommissionRow from "./WalletCommissionRow";

interface IWalletProps {

}

interface IWalletState {
    cashbackApproved: number,
    cashbackPending: number,
    pointsApproved: number,
    pointsPending: number,
    totalTransactions: number,
    transactions: TransactionDto[],
    commissions: CommissionDto[]
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
            transactions: [],
            commissions: []
        };
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.WALLET));
        fetchWalletInfo(this);
        fetchCommissions(this);
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.WALLET));
    }

    public render() {
        const transactionsHistory = this.state.transactions ? this.state.transactions.map((value, index) => {
            return <WalletTransactionRow key={"tx" + index} date={value.createdAt.toDate().toDateString()}
                                         type={TxType[value.type]} amount={value.amount} target={value.target}/>
        }) : null;

        const commissionsHistory = this.state.commissions ? this.state.commissions.map((value, index) => {
            return <WalletCommissionRow key={"cm" + index} amount={value.amount}
                                        date={value.createdAt.toDate().toDateString()}
                                        shopUniqueCode={value.shopId} status={CommissionStatus[value.status]}/>
        }) : null;

        return (
            <React.Fragment>
                <section className={"product_description_area"}>
                    <div className={"container"}>
                        <div className={"tab-content"}>
                                <div className="row">
                                    <WalletBlock title={"Cashback"} approved={this.state.cashbackApproved}
                                                 pending={this.state.cashbackPending} pendingExists={true}/>
                                    <WalletBlock title={"Charity points"} approved={this.state.pointsApproved}
                                                 pendingExists={false}/>
                                    <WalletBlock title={"History"} approved={this.state.totalTransactions}
                                                 pendingExists={false}/>
                                </div>
                        </div>

                        <div className={"tab-content"}>
                            <h3 className="mb-30 title_color">Cashback History</h3>
                            <div className="progress-table-wrap">
                                <div className="progress-table">
                                    <div className="table-head">
                                        <div className="country">Date</div>
                                        <div className="country">Status</div>
                                        <div className="country">Amount</div>
                                        <div className="country">Shop</div>
                                    </div>
                                    {commissionsHistory}
                                </div>
                            </div>
                        </div>

                        <div className={"tab-content"}>
                            <h3 className="mb-30 title_color">History</h3>
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
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default Wallet;


