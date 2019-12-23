import * as React from "react";
import {StorageKey, TxType} from "../../helper/Constants";
import {getLocalStorage} from "../../helper/StorageHelper";
import {CauseDto} from "../../rest/CauseService";
import {Routes} from "../helper/Routes";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {getUserFromStorage} from "../../helper/AppHelper";
import {LoginDto} from "../login/LoginComponent";

interface IWalletTransactionRowProps {
    date: string,
    type: TxType,
    amount: number,
    target: string
}

class WalletTransactionRow extends React.Component<IWalletTransactionRowProps & InjectedIntlProps> {

    public render() {
        let target;
        if (this.props.type === TxType.DONATION) {
            let causesIdSt = getLocalStorage(StorageKey.CAUSES);
            let causes = [] as CauseDto[];
            if (causesIdSt) {
                causes = JSON.parse(causesIdSt) as CauseDto[];
            }
            let cause = causes.find(value => value.id === this.props.target);
            if (cause) {
                target = cause.details.title;
            }
        } else if (this.props.type === TxType.BONUS) {
            target = this.props.intl.formatMessage({id: "wallet.charity.points"});
        } else if (this.props.type === TxType.CASHOUT || this.props.type === TxType.COMMISSION) {
            const user = getUserFromStorage();
            if (user) {
                const userParsed = JSON.parse(user) as LoginDto;
                target = userParsed.displayName;
            }
        }

        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.date}</div>
                    <div className="country">
                        <h3>
                            {
                                this.props.type === TxType.DONATION ?
                                    <i className="fa fa-heart" aria-hidden="true"
                                       title={this.props.intl.formatMessage({id: "wallet.tx.type.donation"})}/> :
                                    this.props.type === TxType.BONUS ?
                                        <i className="fa fa-thumbs-up" aria-hidden="true" title={
                                            this.props.intl.formatMessage({id: "wallet.tx.type.bonus"})
                                        }/> :
                                        this.props.type === TxType.COMMISSION ?
                                            <i className="fa fa-money" aria-hidden="true" title={
                                                this.props.intl.formatMessage({id: "wallet.tx.type.commission"})
                                            }/> :
                                            <i className="fa fa-money" aria-hidden="true"
                                               title={this.props.intl.formatMessage({id: "wallet.tx.type.cashout"})}/>
                            }
                        </h3>
                    </div>
                    <div className="country">{this.props.amount.toFixed(1)}</div>
                    <div className="country">
                        {this.props.type === TxType.DONATION ?
                            <a href={Routes.CAUSES}>
                                {target}
                            </a>
                            : target}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(WalletTransactionRow);

