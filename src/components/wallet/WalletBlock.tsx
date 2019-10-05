import * as React from "react";
import {emptyHrefLink, InputType} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {CauseDto, fetchCauses} from "../../rest/CauseService";
import CauseDonate from "./CauseDonate";
import GenericInput from "../input/GenericInput";
import {donate} from "../../rest/WalletService";

interface IWalletBlockState {
    withDrawVisible: boolean,
    donateVisible: boolean,
    cashoutVisible: boolean,
    causes: CauseDto[],

    //cashout selection
    selections: boolean[],
    amount: string,
    targetId: string
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
            amount: '',
            targetId: '',
            selections: []
        };
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.donate = this.donate.bind(this);
        this.onAmountChange = this.onAmountChange.bind(this);
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

    onAmountChange(event){
        this.setState({
            amount: event.target.value
        });
    }

    donate() {
        if(!this.state.amount
            || this.state.amount.length < 1
            || parseFloat(this.state.amount) < 1
            || parseFloat(this.state.amount) > this.props.approved){
            alert("Please select a correct amount");
            return;
        }
        if(!this.state.targetId){
            alert("Please select a cause");
            return;
        }
        donate(parseFloat(this.state.amount), this.state.targetId);
    }

    /**
     * This is a callback function, it is invoked from CauseDonate.tsx
     * @param id - the id of the child which will be activated
     */
    public onChildUpdate(id) {
        let selections = [] as boolean[];
        selections[id] = true;

        this.setState({
            targetId: id,
            selections: selections
        });
    }

    public render() {
        const causesList = this.state.causes ? this.state.causes.map(cause => {
            return <CauseDonate key={cause.id} id={cause.id} causeTitle={cause.details.title}
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
                    <div className="container cart_inner">
                        <table className="table">
                            <tbody>
                            <tr className="shipping_area">
                                <td>
                                    <div className="shipping_box">
                                        <h6>
                                            Available amount: <i
                                            className="blue-color">{this.props.approved.toFixed(1)}</i>
                                        </h6>
                                        <GenericInput type={InputType.NUMBER} id={'amount-text-field'}
                                                      max={this.props.approved.toString()}
                                                     handleChange={this.onAmountChange}
                                                      min={"10"}
                                                      step={0.1}
                                                      placeholder={"Amount"}/>
                                        <h3>
                                            <a href={emptyHrefLink}>
                                                <i className="fa fa-money blue-color" aria-hidden="true">Cashout</i>
                                            </a>
                                        </h3>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
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
                                            Available amount: <i
                                            className="blue-color">{this.props.approved.toFixed(1)}</i>
                                        </h6>
                                        <GenericInput type={InputType.NUMBER} id={'amount-text-field'}
                                                      max={this.props.approved.toString()}
                                                      min={"1"}
                                                      handleChange={this.onAmountChange}
                                                      step={0.1}
                                                      placeholder={"Amount"}/>
                                        <h3>
                                            <a href={emptyHrefLink} onClick={this.donate}>
                                                <i className="fa fa-heart blue-color" aria-hidden="true">Donate</i>
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
