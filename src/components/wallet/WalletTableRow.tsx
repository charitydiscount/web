import * as React from "react";

interface IWalletTableRowProps {
    date: string,
    type: string,
    amount: number,
    target: string
}

class WalletTableRow extends React.Component<IWalletTableRowProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="table-row">
                    <div className="country">{this.props.date}</div>
                    <div className="country">{this.props.type}</div>
                    <div className="country">{this.props.amount}</div>
                    <div className="country">{this.props.target}</div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletTableRow;

