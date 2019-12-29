import * as React from "react";
import {CommissionStatus, emptyHrefLink} from "../../helper/Constants";
import {getShopById, ShopDto} from "../../rest/ShopsService";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {CommissionDto} from "../../rest/WalletService";
import {dateOptions} from "../../helper/AppHelper";

interface IWalletTransactionRowProps {
    commission: CommissionDto;
}

class WalletCommissionRow extends React.Component<IWalletTransactionRowProps & InjectedIntlProps> {

    public render() {
        let shop = getShopById(this.props.commission.shopId) as ShopDto;
        let commissionStatus = CommissionStatus[this.props.commission.status].toString();
        let shopName;
        let inactiveShop = false;
        if (!shop) {
            inactiveShop = true;
        }
        if (this.props.commission.program && this.props.commission.program.name) {
            shopName = this.props.commission.program.name;
        } else if (shop) {
            shopName = shop.name;
        }

        let cmTitle;
        switch (commissionStatus) {
            case CommissionStatus.paid.toString():
                cmTitle = <i className="fa fa-money" aria-hidden="true"
                             title={this.props.intl.formatMessage({id: "wallet.tx.status.paid"})}/>;
                break;
            case CommissionStatus.approved.toString():
                cmTitle = <i className="fa fa-thumbs-up" aria-hidden="true" title={
                    this.props.intl.formatMessage({id: "wallet.tx.status.approved"})}/>;
                break;
            case CommissionStatus.rejected.toString():
                cmTitle = <i className="fa fa-ban" aria-hidden="true" title={
                    this.props.intl.formatMessage({id: "wallet.tx.status.rejected"})}/>;
                break;
            default:
                cmTitle = <i className="fa fa-clock-o" aria-hidden="true" title={
                    this.props.intl.formatMessage({id: "wallet.tx.status.pending"})}/>;
                break;
        }


        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.commission.createdAt
                        .toDate()
                        .toLocaleDateString('ro-RO', dateOptions)}</div>
                    <div className="country">
                        <h3>{cmTitle}</h3>
                    </div>
                    <div className="country">{this.props.commission.amount.toFixed(1)}</div>
                    {inactiveShop &&
                    <div className="country">
                        <a title={this.props.intl.formatMessage({id: "wallet.commission.shop.inactive"})}
                           href={emptyHrefLink} style={{
                            color: 'red',
                            textDecoration: 'underline'
                        }}>
                            {shopName}
                        </a>
                    </div>
                    }
                    {!inactiveShop &&
                    <div className="country">
                        {shopName}
                    </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(WalletCommissionRow);

