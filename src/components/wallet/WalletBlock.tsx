import * as React from "react";
import {emptyHrefLink} from "../../helper/Constants";

interface IWalletBlockProps {
    title: String,
    approved: Number,
    pending?: Number,
    pendingExists: boolean
}

class WalletBlock extends React.Component<IWalletBlockProps> {

    public render() {
        return (
            <React.Fragment>
                <div className="col-4 total_rate">
                    <div className="box_total">
                        <h5>{this.props.title}</h5>
                        <a href={emptyHrefLink}>
                            <h4>{this.props.approved ? this.props.approved : 0}</h4>
                            {this.props.pendingExists ?
                                <h6>Pending:{this.props.pending ? this.props.pending : 0}</h6>
                                : null
                            }
                        </a>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletBlock;
