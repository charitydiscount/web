import * as React from "react";
import {TxType} from "../../helper/Constants";

interface IWalletTableRowProps {
    date: string,
    type: TxType,
    amount: number,
    target: string
}

class WalletTableRow extends React.Component<IWalletTableRowProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.date}</div>
                    <div className="country">
                        {
                            this.props.type === TxType.DONATION ?
                                <i className="fa fa-heart" aria-hidden="true" title={"Donation"}></i> :
                                this.props.type === TxType.BONUS ?
                                    <i className="fa fa-thumbs-up" aria-hidden="true" title={'Bonus'}></i> :
                                    <i className="fa fa-money" aria-hidden="true" title={'Cashout'}></i>
                        }
                    </div>
                    <div className="country">{this.props.amount}</div>
                    <div className="country">{this.props.target}</div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletTableRow;

