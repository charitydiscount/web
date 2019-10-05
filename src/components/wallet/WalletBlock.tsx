import * as React from "react";
import {emptyHrefLink, InputType} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {CauseDto, fetchCauses} from "../../rest/CauseService";
import CauseDonate from "./CauseDonate";
import GenericInput from "../input/GenericInput";

interface IWalletBlockState {
    withDrawVisible: boolean,
    donateVisible: boolean,
    cashoutVisible: boolean,
    causes: CauseDto[],
    selections: boolean[]
}

interface IWalletBlockProps {
    title: string,
    approved: number,
    pending?: number,
    pendingExists: boolean
}

class WalletBlock extends React.Component<IWalletBlockProps, IWalletBlockState> {

    constructor(props: IWalletBlockProps) {
        super(props);
        this.state = {
            withDrawVisible: false,
            cashoutVisible: false,
            donateVisible: false,
            causes: [],
            selections: []
        };
        this.onChildUpdate = this.onChildUpdate.bind(this);
    }

    public componentDidMount() {
        if (this.props.pendingExists) {
            fetchCauses(this);
        }
    }

    openModal() {
        this.setState({
            withDrawVisible: true,
            cashoutVisible: false,
            donateVisible: false
        });
    }

    openDonateModal() {
        this.setState({
            withDrawVisible: false,
            cashoutVisible: false,
            donateVisible: true
        });
    }

    openCashoutModal() {
        this.setState({
            withDrawVisible: false,
            cashoutVisible: true,
            donateVisible: false
        });
    }

    closeModal() {
        this.setState({
            withDrawVisible: false,
            cashoutVisible: false,
            donateVisible: false,
            selections: []
        });
    }

    /**
     * This is a callback function, it is invoked from CauseDonate.tsx
     * @param id - the id of the child which will be activated
     */
    public onChildUpdate(id) {
        let selections = [] as boolean[];
        selections[id] = true;

        this.setState({
            selections: selections
        });
    }

    public render() {
        const causesList = this.state.causes ? this.state.causes.map(cause => {
            return <CauseDonate key={cause.details.title} causeTitle={cause.details.title}
                                onUpdate={this.onChildUpdate} selections={this.state.selections}/>
        }) : null;

        return (
            <React.Fragment>
                <Modal visible={this.state.withDrawVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <a href={emptyHrefLink} className="btn submit_btn" onClick={() => this.openCashoutModal()}>
                        Cashout
                    </a>
                    <a href={emptyHrefLink} className="btn submit_btn" onClick={() => this.openDonateModal()}>
                        Donate
                    </a>
                </Modal>
                <Modal visible={this.state.cashoutVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>

                </Modal>
                <Modal visible={this.state.donateVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="container cart_inner">
                        <table className="table">
                            <tbody>
                            <tr className="shipping_area">
                                <td>
                                    <div className="shipping_box">
                                        <ul className="list">
                                            {causesList}
                                        </ul>

                                        <h6>
                                            Available amount: <i className="blue-color">{this.props.approved.toFixed(1)}</i>
                                        </h6>
                                        <GenericInput type={InputType.NUMBER} id={'amount-text-field'}
                                                      max={this.props.approved.toString()}
                                                      min={"0"}
                                                      step={0.1}
                                                      placeholder={"Amount"}/>
                                        <h3>
                                            <a href={emptyHrefLink}>
                                                <i className="fa fa-thumbs-o-up blue-color" aria-hidden="true">Donate</i>
                                            </a>
                                        </h3>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal>

                <div className="col-lg-4 total_rate">
                    <div className="box_total">
                        <h5>{this.props.title}</h5>
                        <h4>{this.props.approved ? this.props.approved.toFixed(1) : 0}</h4>
                        {this.props.pendingExists ?
                            <div>
                                <h6>Pending:{this.props.pending ? this.props.pending : 0}</h6>
                                <br/>
                                {this.props.approved > 0 ?
                                    <a href={emptyHrefLink} onClick={() => this.openModal()}
                                       className="btn submit_btn genric-btn circle">Withdraw
                                    </a>
                                    : null}
                            </div>
                            : null
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default WalletBlock;
