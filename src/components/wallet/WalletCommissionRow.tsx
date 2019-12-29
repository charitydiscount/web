import * as React from "react";
import {CommissionStatus, emptyHrefLink} from "../../helper/Constants";
import {getShopById, ShopDto} from "../../rest/ShopsService";
import {InjectedIntlProps, injectIntl} from "react-intl";

interface IWalletTransactionRowProps {
    amount: number,
    date: string,
    shopId?: string,
    shopName: string,
    status: CommissionStatus
}

class WalletCommissionRow extends React.Component<IWalletTransactionRowProps & InjectedIntlProps> {

    public render() {
        let shop = getShopById(this.props.shopId) as ShopDto;
        let inactiveShop = false;
        if (!shop) {
            inactiveShop = true;
        }

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
                    {inactiveShop &&
                    <div className="country">
                        <a title={this.props.intl.formatMessage({id: "wallet.commission.shop.inactive"})} href={emptyHrefLink} style={{
                            color: 'red',
                            textDecoration: 'underline'
                        }}>
                            {this.props.shopName}
                        </a>
                    </div>
                    }
                    {!inactiveShop &&
                    <div className="country">
                        {this.props.shopName}
                    </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(WalletCommissionRow);

