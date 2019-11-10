import * as React from 'react';
import {store} from '../../index';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import {Stages} from '../helper/Stages';
import WalletBlock from './WalletBlock';
import {
    CommissionDto, CommissionWrapper,
    fetchCommissions,
    fetchWalletInfo,
    TransactionDto, WalletWrapper,
} from '../../rest/WalletService';
import WalletTransactionRow from './WalletTransactionRow';
import {CommissionStatus, TxType} from '../../helper/Constants';
import WalletCommissionRow from './WalletCommissionRow';
import FadeLoader from 'react-spinners/FadeLoader';
import {spinnerCss} from '../../helper/AppHelper';
import {InjectedIntlProps, injectIntl, FormattedMessage} from 'react-intl';
import {CauseDto, fetchCauses} from "../../rest/CauseService";

interface IWalletProps {
}

interface IWalletState {
    cashbackApproved: number;
    cashbackPending: number;
    pointsApproved: number;
    pointsPending: number;
    totalTransactions: number;
    isLoading: boolean;
    isLoadingCommissions: boolean;
    transactions: TransactionDto[];
    commissions: CommissionDto[];
    causes: CauseDto[]
}

class Wallet extends React.Component<IWalletProps & InjectedIntlProps,
    IWalletState> {
    constructor(props: IWalletProps & InjectedIntlProps) {
        super(props);
        this.state = {
            cashbackApproved: 0,
            cashbackPending: 0,
            pointsApproved: 0,
            pointsPending: 0,
            totalTransactions: 0,
            transactions: [],
            isLoading: true,
            isLoadingCommissions: true,
            commissions: [],
            causes: []
        };
    }

    async componentDidMount() {
        try {
            let response = await fetchCauses();
            if (response) {
                this.setState({
                        causes: response as CauseDto[]
                    }
                )
            }
        } catch (error) {
            //causes not loaded
        }

        try {
            let response = await fetchWalletInfo();
            if (response) {
                let data = response as WalletWrapper;
                this.setState({
                    cashbackApproved: data.cashback.approved,
                    cashbackPending: data.cashback.pending,
                    pointsApproved: data.points.approved,
                    pointsPending: data.points.pending,
                    totalTransactions: data.transactions
                        ? data.transactions.length
                        : 0,
                    transactions: data.transactions,
                    isLoading: false,
                })
            } else {
                this.setState({
                    isLoading: false
                })
            }
        } catch (error) {
            this.setState({
                isLoading: false
            })
            //transaction history info not loaded or empty values
        }

        try {
            let response = await fetchCommissions();
            if (response) {
                let data = response as CommissionWrapper;
                this.setState({
                    commissions: data.transactions,
                    isLoadingCommissions: false
                })
            } else {
                this.setState({
                    isLoadingCommissions: false
                })
            }
        } catch (error) {
            this.setState({
                isLoadingCommissions: false
            })
            //commissions history info not loaded or empty values
        }

        store.dispatch(NavigationsAction.setStageAction(Stages.WALLET));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.WALLET));
    }

    public render() {
        var dateOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };

        const transactionsHistory = this.state.transactions
            ? this.state.transactions.map((value, index) => {
                return (
                    <WalletTransactionRow
                        key={'tx' + index}
                        date={value.date
                            .toDate()
                            .toLocaleDateString('ro-RO', dateOptions)}
                        type={TxType[value.type]}
                        amount={value.amount}
                        target={value.target}
                    />
                );
            })
            : null;

        const commissionsHistory = this.state.commissions
            ? this.state.commissions.map((value, index) => {
                return (
                    <WalletCommissionRow
                        key={'cm' + index}
                        amount={value.amount}
                        date={value.createdAt
                            .toDate()
                            .toLocaleDateString('ro-RO', dateOptions)}
                        shopUniqueCode={value.shopId}
                        status={CommissionStatus[value.status]}
                    />
                );
            })
            : null;

        return (
            <React.Fragment>
                <section className={'product_description_area'}>
                    <div className={'container'}>
                        <FadeLoader
                            loading={
                                this.state.isLoading ||
                                this.state.isLoadingCommissions
                            }
                            color={'#1641ff'}
                            css={spinnerCss}
                        />

                        {!this.state.isLoading &&
                        !this.state.isLoadingCommissions && (
                            <React.Fragment>
                                <div className={'tab-content'}>
                                    <div className="row">
                                        <WalletBlock
                                            title={this.props.intl.formatMessage(
                                                {id: 'wallet.cashback'}
                                            )}
                                            approved={
                                                this.state.cashbackApproved
                                            }
                                            pending={
                                                this.state.cashbackPending
                                            }
                                            pendingExists={true}
                                            money={true}
                                            causes={this.state.causes}
                                        />
                                        <WalletBlock
                                            title={this.props.intl.formatMessage(
                                                {
                                                    id:
                                                        'wallet.charity.points',
                                                }
                                            )}
                                            approved={
                                                this.state.pointsApproved
                                            }
                                            money={false}
                                        />
                                        <WalletBlock
                                            title={this.props.intl.formatMessage(
                                                {id: 'wallet.history'}
                                            )}
                                            approved={
                                                this.state.totalTransactions
                                            }
                                            pendingExists={false}
                                            money={false}
                                        />
                                    </div>
                                </div>

                                {commissionsHistory &&
                                commissionsHistory.length > 0 && (
                                    <div className={'tab-content'}>
                                        <h3 className="mb-30 title_color">
                                            <FormattedMessage
                                                id="wallet.cashback.history"
                                                defaultMessage="Cashback History"
                                            />
                                        </h3>
                                        <div className="progress-table-wrap">
                                            <div className="progress-table">
                                                <div className="table-head">
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.date"
                                                            defaultMessage="Date"
                                                        />
                                                    </div>
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.status"
                                                            defaultMessage="Status"
                                                        />
                                                    </div>
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.amount"
                                                            defaultMessage="Amount"
                                                        />
                                                    </div>
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.shop"
                                                            defaultMessage="Shop"
                                                        />
                                                    </div>
                                                </div>
                                                {commissionsHistory}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {transactionsHistory &&
                                transactionsHistory.length > 0 && (
                                    <div className={'tab-content'}>
                                        <h3 className="mb-30 title_color">
                                            <FormattedMessage
                                                id="wallet.history"
                                                defaultMessage="History"
                                            />
                                        </h3>
                                        <div className="progress-table-wrap">
                                            <div className="progress-table">
                                                <div className="table-head">
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.date"
                                                            defaultMessage="Date"
                                                        />
                                                    </div>
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.type"
                                                            defaultMessage="Type"
                                                        />
                                                    </div>
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.amount"
                                                            defaultMessage="Amount"
                                                        />
                                                    </div>
                                                    <div className="country">
                                                        <FormattedMessage
                                                            id="wallet.table.target"
                                                            defaultMessage="Target"
                                                        />
                                                    </div>
                                                </div>
                                                {transactionsHistory}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default injectIntl(Wallet);
