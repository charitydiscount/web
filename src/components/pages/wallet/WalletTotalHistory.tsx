import React from "react";
import { FormattedMessage } from "react-intl";
import { roundMoney } from "../../../helper/AppHelper";

interface WalletTotalHistoryProps {
    totalCashout: number
}

class WalletTotalHistory extends React.Component<WalletTotalHistoryProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="col-lg-4 total_rate">
                    <div className="box_total">
                        <h5>
                            <FormattedMessage
                                id="wallet.block.total.cashout"
                                defaultMessage="Total retrasi:"/>
                        </h5>
                        <h4>
                            {roundMoney(this.props.totalCashout)}
                        </h4>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletTotalHistory;