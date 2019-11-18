import * as React from "react";
import {CommissionStatus} from "../../helper/Constants";
import {getShopById, ShopDto} from "../../rest/ShopsService";
import {InjectedIntlProps, injectIntl} from "react-intl";

interface IWalletTransactionRowProps {
    amount: number,
    date: string,
    shopUniqueCode: string,
    status: CommissionStatus
}

class WalletCommissionRow extends React.Component<IWalletTransactionRowProps & InjectedIntlProps> {

    public render() {
        let shop = getShopById(this.props.shopUniqueCode) as ShopDto;

        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.date}</div>
                    <div className="country">
                        <h3>
                            {
                                this.props.status === CommissionStatus.paid ?
                                    <i className="fa fa-money" aria-hidden="true"
                                       title={this.props.intl.formatMessage({id: "wallet.tx.status.paid"})}/> :
                                    this.props.status === CommissionStatus.approved ?
                                        <i className="fa fa-thumbs-up" aria-hidden="true" title={
                                            this.props.intl.formatMessage({id: "wallet.tx.status.approved"})
                                        }/> :
                                        this.props.status === CommissionStatus.rejected ?
                                            <i className="fa fa-ban" aria-hidden="true" title={
                                                this.props.intl.formatMessage({id: "wallet.tx.status.rejected"})
                                            }/> :
                                            <i className="fa fa-clock-o" aria-hidden="true" title={
                                                this.props.intl.formatMessage({id: "wallet.tx.status.pending"})
                                            }/>
                            }
                        </h3>
                    </div>
                    <div className="country">{this.props.amount.toFixed(1)}</div>
                    <div className="country">
                        {shop ? shop.name : ''}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(WalletCommissionRow);

