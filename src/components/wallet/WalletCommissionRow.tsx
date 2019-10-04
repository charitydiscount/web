import * as React from "react";
import {CommissionStatus} from "../../helper/Constants";
import {getShopByUniqueCode, ShopDto} from "../../rest/ShopsService";

interface IWalletTransactionRowProps {
    amount: number,
    date: string,
    shopUniqueCode: string,
    status: CommissionStatus
}

class WalletCommissionRow extends React.Component<IWalletTransactionRowProps> {

    public render() {
        let shop = getShopByUniqueCode(this.props.shopUniqueCode) as ShopDto;

        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.date}</div>
                    <div className="country">
                        {
                            this.props.status === CommissionStatus.paid ?
                                <i className="fa fa-money" aria-hidden="true" title={'Paid'}></i> :
                                this.props.status === CommissionStatus.approved ?
                                    <i className="fa fa-thumbs-up" aria-hidden="true" title={'Approved'}></i> :
                                    this.props.status === CommissionStatus.rejected ?
                                        <i className="fa fa-ban" aria-hidden="true" title={'Rejected'}></i> :
                                        <i className="fa fa-clock-o" aria-hidden="true" title={'Pending'}></i>
                        }
                    </div>
                    <div className="country">{this.props.amount}</div>
                    <div className="country">
                        {shop ? shop.name : ''}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletCommissionRow;

