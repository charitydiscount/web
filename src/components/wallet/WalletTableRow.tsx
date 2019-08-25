import * as React from "react";

interface IWalletTableRowProps {
    shop: String,
    date: String,
    bonus: Number,
    status: String
}

class WalletTableRow extends React.Component<IWalletTableRowProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.shop}</div>
                    <div className="country">{this.props.date}</div>
                    <div className="country">{this.props.bonus}</div>
                    <div className="country">{this.props.status}</div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletTableRow;

