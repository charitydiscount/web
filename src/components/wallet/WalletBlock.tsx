import * as React from "react";
import {emptyHrefLink, InputType} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {CauseDto} from "../../rest/CauseService";
import CauseDonate from "./CauseDonate";
import GenericInput from "../input/GenericInput";
import {createRequest} from "../../rest/WalletService";
import {FormattedMessage} from 'react-intl';
import {InjectedIntlProps, injectIntl} from "react-intl";

interface IWalletBlockState {
    withDrawVisible: boolean,
    donateVisible: boolean,
    cashoutVisible: boolean,

    //cashout selection
    selections: boolean[],
    amount: string,
    targetId: string
}

interface IWalletBlockProps {
    title: string,
    approved: number,
    pending?: number,
    pendingExists: boolean,
    money: boolean,
    causes ?: CauseDto[]
}

class WalletBlock extends React.Component<IWalletBlockProps & InjectedIntlProps, IWalletBlockState> {

    constructor(props: IWalletBlockProps) {
        super(props);
        this.state = {
            withDrawVisible: false,
            cashoutVisible: false,
            donateVisible: false,
            amount: '',
            targetId: '',
            selections: []
        };
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.donate = this.donate.bind(this);
        this.cashout = this.cashout.bind(this);
        this.onAmountChange = this.onAmountChange.bind(this);
    }

    componentDidMount() {

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

    onAmountChange(event) {
        this.setState({
            amount: event.target.value
        });
    }

    cashout() {
        if (!this.state.amount
            || this.state.amount.length < 1
            || parseFloat(this.state.amount) < 10
            || parseFloat(this.state.amount) > this.props.approved) {
            alert("Please select a correct amount. minimum is 10 RON");
            return;
        }

        createRequest(parseFloat(this.state.amount), "CASHOUT", this.state.targetId);
    }

    donate() {
        if (!this.state.amount
            || this.state.amount.length < 1
            || parseFloat(this.state.amount) < 1
            || parseFloat(this.state.amount) > this.props.approved) {
            alert("Please select a correct amount");
            return;
        }
        if (!this.state.targetId) {
            alert("Please select a cause");
            return;
        }
        createRequest(parseFloat(this.state.amount), "DONATION", this.state.targetId);
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
        const causesList = this.props.causes ? this.props.causes.map(cause => {
            return <CauseDonate key={cause.id} id={cause.id} causeTitle={cause.details.title}
                                onUpdate={this.onChildUpdate} selections={this.state.selections}/>
        }) : null;

        return (
            <React.Fragment>
                <Modal visible={this.state.withDrawVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <a href={emptyHrefLink} className="btn submit_btn" onClick={() => this.openCashoutModal()}>
                        <FormattedMessage id="wallet.block.cashout" defaultMessage="Cashout"/>
                    </a>
                    <a href={emptyHrefLink} className="btn submit_btn" onClick={() => this.openDonateModal()}>
                        <FormattedMessage id="wallet.block.donate" defaultMessage="Donate"/>
                    </a>
                </Modal>
                <Modal visible={this.state.cashoutVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="container cart_inner">
                        <table className="table">
                            <tbody>
                            <tr className="shipping_area">
                                <td>
                                    <div className="shipping_box">
                                        <GenericInput type={InputType.TEXT} id={"name"} placeholder={
                                            this.props.intl.formatMessage({id: "wallet.block.cashout.name"})
                                        }/>
                                        <GenericInput type={InputType.TEXT} id={"iban"} placeholder={
                                            this.props.intl.formatMessage({id: "wallet.block.cashout.iban"})
                                        }/>

                                        <h6>
                                            <FormattedMessage id="wallet.block.available.amount"
                                                              defaultMessage="Available amount: "/>
                                            <i className="blue-color">{this.props.approved.toFixed(1)}</i>
                                        </h6>
                                        <GenericInput type={InputType.NUMBER} id={'amount-text-field-cashout'}
                                                      max={this.props.approved.toString()}
                                                      handleChange={this.onAmountChange}
                                                      min={"10"}
                                                      step={0.1}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "wallet.table.amount"})
                                                      }/>
                                        <h3>
                                            <a href={emptyHrefLink} onClick={this.cashout}>
                                                <i className="fa fa-money blue-color" aria-hidden="true">
                                                    <FormattedMessage id="wallet.block.cashout"
                                                                      defaultMessage="Cashout "/>
                                                </i>
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
                                            <FormattedMessage id="wallet.block.available.amount"
                                                              defaultMessage="Available amount: "/>
                                            <i className="blue-color">{this.props.approved.toFixed(1)}</i>
                                        </h6>
                                        <GenericInput type={InputType.NUMBER} id={'amount-text-field-donation'}
                                                      max={this.props.approved.toString()}
                                                      min={"1"}
                                                      handleChange={this.onAmountChange}
                                                      step={0.1}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "wallet.table.amount"})
                                                      }/>
                                        <h3>
                                            <a href={emptyHrefLink} onClick={this.donate}>
                                                <i className="fa fa-heart blue-color" aria-hidden="true">
                                                    <FormattedMessage id="wallet.block.donate"
                                                                      defaultMessage="Donate "/>
                                                </i>
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
                                <h6><FormattedMessage id="wallet.block.pending" defaultMessage="Pending:"/>
                                    {this.props.pending ? this.props.pending.toFixed(1) : 0}</h6>
                                {this.props.money ?
                                    <div>
                                        {this.props.approved > 0 ?
                                            <div>
                                                <br/>
                                                <a href={emptyHrefLink} onClick={() => this.openModal()}
                                                   className="btn submit_btn genric-btn circle">
                                                    <FormattedMessage id="wallet.block.withdraw"
                                                                      defaultMessage="Withdraw"/>
                                                </a>
                                            </div> : null}
                                    </div> : null}
                            </div> : null
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(WalletBlock);
