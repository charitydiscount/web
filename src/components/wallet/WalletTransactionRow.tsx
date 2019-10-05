import * as React from "react";
import {StorageKey, TxType} from "../../helper/Constants";
import {getLocalStorage} from "../../helper/StorageHelper";
import {CauseDto} from "../../rest/CauseService";
import {Routes} from "../helper/Routes";

interface IWalletTransactionRowProps {
    date: string,
    type: TxType,
    amount: number,
    target: string
}

class WalletTransactionRow extends React.Component<IWalletTransactionRowProps> {

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
        }
        if (this.props.type === TxType.BONUS) {
            target = 'Charity points';
        }

        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.date}</div>
                    <div className="country">
                        <h3>
                        {
                            this.props.type === TxType.DONATION ?
                                <i className="fa fa-heart" aria-hidden="true" title={"Donation"}></i> :
                                this.props.type === TxType.BONUS ?
                                    <i className="fa fa-thumbs-up" aria-hidden="true" title={'Bonus'}></i> :
                                    <i className="fa fa-money" aria-hidden="true" title={'Cashout'}></i>
                        }
                        </h3>
                    </div>
                    <div className="country">{this.props.amount}</div>
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

export default WalletTransactionRow;

