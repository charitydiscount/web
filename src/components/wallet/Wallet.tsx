import * as React from 'react';
import { store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import WalletBlock from './WalletBlock';
import {
    CommissionDto,
    fetchCommissions,
    fetchWallet,
    TransactionDto,
    WalletWrapper,
} from '../../rest/WalletService';
import WalletTransactionRow from './WalletTransactionRow';
import { CommissionStatus, emptyHrefLink } from '../../helper/Constants';
import WalletCommissionRow from './WalletCommissionRow';
import FadeLoader from 'react-spinners/FadeLoader';
import { spinnerCss } from '../../helper/AppHelper';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';
import { CauseDto, fetchCauses } from '../../rest/CauseService';

interface IWalletProps {
    match: any;
    intl: IntlShape;
}

interface IWalletState {
    cashbackApproved: number;
    cashbackPending: number;
    pointsApproved: number;
    pointsPending: number;
    isLoading: boolean;
    isLoadingCommissions: boolean;
    transactions: TransactionDto[];
    commissions: CommissionDto[];
    causes: CauseDto[];

    //sort commissions
    comSortDateAsc: string;
    comSortStatusAsc: string;

    //sort transactions
    tranSortDateAsc: string;
    tranSortTypeAsc: string;
}

class Wallet extends React.Component<IWalletProps, IWalletState> {
    constructor(props: IWalletProps) {
        super(props);
        this.state = {
            cashbackApproved: 0,
            cashbackPending: 0,
            pointsApproved: 0,
            pointsPending: 0,
            transactions: [],
            isLoading: true,
            isLoadingCommissions: true,
            commissions: [],
            causes: [],
            comSortDateAsc: 'true',
            comSortStatusAsc: '',
            tranSortDateAsc: 'true',
            tranSortTypeAsc: '',
        };
    }

    async loadWallet() {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true,
            });
        }

        try {
            let response = await fetchCauses();
            if (response) {
                this.setState({
                    causes: response as CauseDto[],
                });
            }
        } catch (error) {
            //causes not loaded
        }

        try {
            let response = await fetchWallet();
            let data = response.data() as WalletWrapper;
            this.setState({
                cashbackApproved: data.cashback.approved,
                cashbackPending: data.cashback.pending,
                pointsApproved: data.points.approved,
                pointsPending: data.points.pending,
                transactions: data.transactions.map((t) => {
                    if (typeof t.target === 'string') {
                        return { ...t, target: { id: t.target, name: '' } };
                    } else {
                        return t;
                    }
                }),
                isLoading: false,
            });
        } catch (error) {
            this.setState({
                isLoading: false,
            });
            //transaction history info not loaded or empty values
        }
    }

    async componentDidMount() {
        this.loadWallet();

        try {
            let response = await fetchCommissions();
            if (response) {
                let data = response as CommissionDto[];
                this.setState({
                    commissions: data,
                    isLoadingCommissions: false,
                });
            } else {
                this.setState({
                    isLoadingCommissions: false,
                });
            }
        } catch (error) {
            this.setState({
                isLoadingCommissions: false,
            });
            //commissions history info not loaded or empty values
        }

        store.dispatch(NavigationsAction.setStageAction(Stages.WALLET));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.WALLET));
    }

    public render() {
        const transactionsHistory = this.state.transactions
            ? this.state.transactions
                  .sort((a, b) => {
                      if (this.state.tranSortDateAsc) {
                          if (this.state.tranSortDateAsc === 'true') {
                              return a.date > b.date ? -1 : 1;
                          } else {
                              return a.date < b.date ? -1 : 1;
                          }
                      }
                      if (this.state.tranSortTypeAsc) {
                          if (this.state.tranSortTypeAsc === 'true') {
                              return a.type > b.type ? -1 : 1;
                          } else {
                              return a.type < b.type ? -1 : 1;
                          }
                      }
                      return 0;
                  })
                  .map((value, index) => {
                      return (
                          <WalletTransactionRow
                              key={'tx' + index}
                              transaction={value}
                          />
                      );
                  })
            : null;

        const commissionsHistory = this.state.commissions
            ? this.state.commissions
                  .sort((a, b) => {
                      if (this.state.comSortDateAsc) {
                          if (this.state.comSortDateAsc === 'true') {
                              return a.createdAt > b.createdAt ? -1 : 1;
                          } else {
                              return a.createdAt < b.createdAt ? -1 : 1;
                          }
                      }
                      if (this.state.comSortStatusAsc) {
                          if (this.state.comSortStatusAsc === 'true') {
                              return CommissionStatus[a.status] >
                                  CommissionStatus[b.status]
                                  ? -1
                                  : 1;
                          } else {
                              return CommissionStatus[a.status] <
                                  CommissionStatus[b.status]
                                  ? -1
                                  : 1;
                          }
                      }
                      return 0;
                  })
                  .map((value, index) => {
                      return (
                          <WalletCommissionRow
                              key={'cm' + index}
                              commission={value}
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
                            color={'#e31f29'}
                            css={spinnerCss}
                        />

                        {!this.state.isLoading &&
                            !this.state.isLoadingCommissions && (
                                <React.Fragment>
                                    <div className={'tab-content'}>
                                        <div className="row">
                                            <WalletBlock
                                                title={this.props.intl.formatMessage(
                                                    { id: 'wallet.cashback' }
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
                                                openDonateWithCaseId={
                                                    this.props.match.params
                                                        .caseId
                                                }
                                                onTxCompleted={() =>
                                                    this.loadWallet()
                                                }
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
                                                                <a
                                                                    href={
                                                                        emptyHrefLink
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.preventDefault();
                                                                        this
                                                                            .state
                                                                            .comSortDateAsc &&
                                                                        this
                                                                            .state
                                                                            .comSortDateAsc ===
                                                                            'true'
                                                                            ? this.setState(
                                                                                  {
                                                                                      comSortDateAsc:
                                                                                          'false',
                                                                                      comSortStatusAsc:
                                                                                          '',
                                                                                  }
                                                                              )
                                                                            : this.setState(
                                                                                  {
                                                                                      comSortDateAsc:
                                                                                          'true',
                                                                                      comSortStatusAsc:
                                                                                          '',
                                                                                  }
                                                                              );
                                                                    }}
                                                                >
                                                                    <FormattedMessage
                                                                        id="wallet.table.date"
                                                                        defaultMessage="Date"
                                                                    />
                                                                    {this.state
                                                                        .comSortDateAsc &&
                                                                        this
                                                                            .state
                                                                            .comSortDateAsc ===
                                                                            'true' && (
                                                                            <i className="fa fa-arrow-up" />
                                                                        )}
                                                                    {this.state
                                                                        .comSortDateAsc &&
                                                                        this
                                                                            .state
                                                                            .comSortDateAsc ===
                                                                            'false' && (
                                                                            <i className="fa fa-arrow-down" />
                                                                        )}
                                                                </a>
                                                            </div>
                                                            <div className="country">
                                                                <a
                                                                    href={
                                                                        emptyHrefLink
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.preventDefault();
                                                                        this
                                                                            .state
                                                                            .comSortStatusAsc &&
                                                                        this
                                                                            .state
                                                                            .comSortStatusAsc ===
                                                                            'true'
                                                                            ? this.setState(
                                                                                  {
                                                                                      comSortStatusAsc:
                                                                                          'false',
                                                                                      comSortDateAsc:
                                                                                          '',
                                                                                  }
                                                                              )
                                                                            : this.setState(
                                                                                  {
                                                                                      comSortStatusAsc:
                                                                                          'true',
                                                                                      comSortDateAsc:
                                                                                          '',
                                                                                  }
                                                                              );
                                                                    }}
                                                                >
                                                                    <FormattedMessage
                                                                        id="wallet.table.status"
                                                                        defaultMessage="Status"
                                                                    />
                                                                    {this.state
                                                                        .comSortStatusAsc &&
                                                                        this
                                                                            .state
                                                                            .comSortStatusAsc ===
                                                                            'true' && (
                                                                            <i className="fa fa-arrow-up" />
                                                                        )}
                                                                    {this.state
                                                                        .comSortStatusAsc &&
                                                                        this
                                                                            .state
                                                                            .comSortStatusAsc ===
                                                                            'false' && (
                                                                            <i className="fa fa-arrow-down" />
                                                                        )}
                                                                </a>
                                                            </div>
                                                            <div className="country">
                                                                <FormattedMessage
                                                                    id="wallet.table.amount"
                                                                    defaultMessage="Amount"
                                                                />
                                                            </div>
                                                            <div className="country">
                                                                <FormattedMessage
                                                                    id="wallet.table.source"
                                                                    defaultMessage="Source"
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
                                                                <a
                                                                    href={
                                                                        emptyHrefLink
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.preventDefault();
                                                                        this
                                                                            .state
                                                                            .tranSortDateAsc &&
                                                                        this
                                                                            .state
                                                                            .tranSortDateAsc ===
                                                                            'true'
                                                                            ? this.setState(
                                                                                  {
                                                                                      tranSortDateAsc:
                                                                                          'false',
                                                                                      tranSortTypeAsc:
                                                                                          '',
                                                                                  }
                                                                              )
                                                                            : this.setState(
                                                                                  {
                                                                                      tranSortDateAsc:
                                                                                          'true',
                                                                                      tranSortTypeAsc:
                                                                                          '',
                                                                                  }
                                                                              );
                                                                    }}
                                                                >
                                                                    <FormattedMessage
                                                                        id="wallet.table.date"
                                                                        defaultMessage="Date"
                                                                    />
                                                                    {this.state
                                                                        .tranSortDateAsc &&
                                                                        this
                                                                            .state
                                                                            .tranSortDateAsc ===
                                                                            'true' && (
                                                                            <i className="fa fa-arrow-up" />
                                                                        )}
                                                                    {this.state
                                                                        .tranSortDateAsc &&
                                                                        this
                                                                            .state
                                                                            .tranSortDateAsc ===
                                                                            'false' && (
                                                                            <i className="fa fa-arrow-down" />
                                                                        )}
                                                                </a>
                                                            </div>
                                                            <div className="country">
                                                                <a
                                                                    href={
                                                                        emptyHrefLink
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.preventDefault();
                                                                        this
                                                                            .state
                                                                            .tranSortTypeAsc &&
                                                                        this
                                                                            .state
                                                                            .tranSortTypeAsc ===
                                                                            'true'
                                                                            ? this.setState(
                                                                                  {
                                                                                      tranSortTypeAsc:
                                                                                          'false',
                                                                                      tranSortDateAsc:
                                                                                          '',
                                                                                  }
                                                                              )
                                                                            : this.setState(
                                                                                  {
                                                                                      tranSortTypeAsc:
                                                                                          'true',
                                                                                      tranSortDateAsc:
                                                                                          '',
                                                                                  }
                                                                              );
                                                                    }}
                                                                >
                                                                    <FormattedMessage
                                                                        id="wallet.table.type"
                                                                        defaultMessage="Type"
                                                                    />
                                                                    {this.state
                                                                        .tranSortTypeAsc &&
                                                                        this
                                                                            .state
                                                                            .tranSortTypeAsc ===
                                                                            'true' && (
                                                                            <i className="fa fa-arrow-up" />
                                                                        )}
                                                                    {this.state
                                                                        .tranSortTypeAsc &&
                                                                        this
                                                                            .state
                                                                            .tranSortTypeAsc ===
                                                                            'false' && (
                                                                            <i className="fa fa-arrow-down" />
                                                                        )}
                                                                </a>
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
