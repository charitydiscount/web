import * as React from 'react';
import { StorageKey, TxType } from '../../../helper/Constants';
import { getLocalStorage } from '../../../helper/StorageHelper';
import { CauseDto } from '../../../rest/CauseService';
import { Routes } from '../../helper/Routes';
import { dateOptions, roundMoney } from '../../../helper/AppHelper';
import { TransactionDto } from '../../../rest/WalletService';
import { Link } from 'react-router-dom';
import { getUserInfo } from "../login/AuthHelper";
import { intl } from "../../../helper/IntlGlobal";

interface IWalletTransactionRowProps {
    transaction: TransactionDto;
}

class WalletTransactionRow extends React.Component<IWalletTransactionRowProps> {
    public render() {
        let target;
        let txType = TxType[this.props.transaction.type].toString();
        let txTitle;
        switch (txType) {
            case TxType.DONATION.toString():
                let causesIdSt = getLocalStorage(StorageKey.CAUSES);
                let causes = [] as CauseDto[];
                if (causesIdSt) {
                    causes = JSON.parse(causesIdSt) as CauseDto[];
                }
                let cause = causes.find(
                    (value) => value.id === this.props.transaction.target.id
                );
                if (cause) {
                    target = cause.details.title;
                }

                txTitle = (
                    <i
                        className="fa fa-heart"
                        aria-hidden="true"
                        style={{ color: 'red' }}
                        title={intl.formatMessage({
                            id: 'wallet.tx.type.donation',
                        })}
                    />
                );
                break;
            case TxType.BONUS.toString():
                target = intl.formatMessage({
                    id: 'wallet.charity.points',
                });
                txTitle = (
                    <i
                        className="fa fa-thumbs-up"
                        aria-hidden="true"
                        style={{ color: 'blue' }}
                        title={intl.formatMessage({
                            id: 'wallet.tx.type.bonus',
                        })}
                    />
                );
                break;
            case TxType.CASHOUT.toString():
                target = (
                    <div>
                        <p>IBAN: {this.props.transaction.target.id}</p>
                        <p>{this.props.transaction.target.name}</p>
                    </div>
                );
                txTitle = (
                    <i
                        className="fa fa-money"
                        aria-hidden="true"
                        title={intl.formatMessage({
                            id: 'wallet.tx.type.cashout',
                        })}
                    />
                );
                break;
            case TxType.COMMISSION.toString():
            case TxType.REFERRAL.toString():
                let currentUser = getUserInfo();
                target = currentUser.displayName || currentUser.email || '';
                txTitle = (
                    <i
                        className="fa fa-money"
                        aria-hidden="true"
                        style={{ color: 'green' }}
                        title={intl.formatMessage({
                            id: 'wallet.tx.type.commission',
                        })}
                    />
                );
                break;
        }

        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">
                        {this.props.transaction.date
                            .toDate()
                            .toLocaleDateString('ro-RO', dateOptions)}
                    </div>
                    <div className="country">
                        <h3>{txTitle}</h3>
                    </div>
                    <div className="country">
                        {roundMoney(this.props.transaction.amount)}{' '}
                        {intl.formatMessage({
                            id: this.props.transaction.currency,
                        })}
                    </div>

                    <div className="country" style={{ overflow: 'auto' }}>
                        {txType === TxType.DONATION.toString() ? (
                            <Link to={Routes.CAUSES}>{target}</Link>
                        ) : (
                            target
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default WalletTransactionRow;
