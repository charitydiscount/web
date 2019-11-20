import * as React from "react";
import {emptyHrefLink, InputType} from "../../helper/Constants";
import Modal from 'react-awesome-modal';
import {CauseDto} from "../../rest/CauseService";
import CauseDonate from "./CauseDonate";
import GenericInput from "../input/GenericInput";
import {createOtpRequest, createRequest, validateOtpCode} from "../../rest/WalletService";
import {FormattedMessage} from 'react-intl';
import {InjectedIntlProps, injectIntl} from "react-intl";
import {spinnerCss} from "../../helper/AppHelper";
import FadeLoader from 'react-spinners/FadeLoader';
import {AccountDto, getUserAccountInfo, updateUserAccount} from "../../rest/UserService";

interface IWalletBlockState {
    donateVisible: boolean,
    cashoutVisible: boolean,
    otpRequestVisible: boolean,
    otpType: string,
    otpCode?: number,

    //cashout/donate selection
    selections: boolean[],
    amount: string,
    name: string,
    iban: string,
    targetId: string,
    faderVisible: boolean
}

interface IWalletBlockProps {
    title: string,
    approved: number,
    pending?: number,
    pendingExists: boolean,
    money: boolean,
    causes?: CauseDto[]
}

class WalletBlock extends React.Component<IWalletBlockProps & InjectedIntlProps, IWalletBlockState> {

    constructor(props: IWalletBlockProps) {
        super(props);
        this.state = {
            cashoutVisible: false,
            donateVisible: false,
            otpRequestVisible: false,
            otpType: '',
            otpCode: undefined,
            amount: '',
            targetId: '',
            name: '',
            iban: '',
            selections: [],
            faderVisible: false
        };
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.donate = this.donate.bind(this);
        this.cashout = this.cashout.bind(this);
        this.creatRequest = this.creatRequest.bind(this);
    }

    componentDidMount() {

    }

    openDonateModal() {
        this.setState({
            cashoutVisible: false,
            donateVisible: true
        });
    }

    async openCashoutModal() {
        try {
            let response = await getUserAccountInfo();
            if (response) {
                this.setState({
                    name: (response as AccountDto).name,
                    iban: (response as AccountDto).iban
                })
            }
        } catch (error) {
            //account info not loaded
        }

        this.setState({
            cashoutVisible: true,
            donateVisible: false
        });
    }

    closeModal() {
        this.setState({
            cashoutVisible: false,
            donateVisible: false,
            otpRequestVisible: false,
            otpType: '',
            otpCode: undefined,
            amount: '',
            targetId: '',
            name: '',
            iban: '',
            selections: []
        });
    }

    async creatRequest() {
        if (!this.state.otpCode) {
            alert(this.props.intl.formatMessage({id: "wallet.block.otp.code.error"}));
            return;
        }

        try {
            let response = await validateOtpCode(this.state.otpCode);
            if (response) {
                try {
                    this.setState({
                        faderVisible: true
                    });
                    let response = await createRequest(parseFloat(this.state.amount), this.state.otpType, this.state.targetId);
                    if (response) {
                        this.setState({
                            faderVisible: false
                        });
                        this.closeModal();
                        window.location.reload();
                    }
                } catch (error) {
                    this.setState({
                        faderVisible: false
                    });
                }
            } else {
                alert(this.props.intl.formatMessage({id: "wallet.block.otp.code.worng.error"}));
            }
        } catch (error) {
            alert(this.props.intl.formatMessage({id: "wallet.block.otp.code.worng.error"}));
        }
    }

    async cashout() {
        if (!this.state.name) {
            alert(this.props.intl.formatMessage({id: "wallet.cashout.name.error"}));
            return;
        }

        if (!this.state.iban) {
            alert(this.props.intl.formatMessage({id: "wallet.cashout.iban.error"}));
            return;
        }

        if (!this.state.amount
            || this.state.amount.length < 1
            || parseFloat(this.state.amount) < 10
            || parseFloat(this.state.amount) > this.props.approved) {
            alert(this.props.intl.formatMessage({id: "wallet.cashout.amount.error"}));
            return;
        }
        try {
            await updateUserAccount(this.state.name, this.state.iban);
        } catch (error) {
            //nothing happens, DB not working
        }

        try {
            let response = await createOtpRequest();
            if (response) {
                this.setState({
                    cashoutVisible: false,
                    otpRequestVisible: true,
                    otpType: 'CASHOUT'
                })
            }
        } catch (error) {
            //nothing happens, DB not working
        }
    }

    async donate() {
        if (!this.state.amount
            || this.state.amount.length < 1
            || parseFloat(this.state.amount) < 1
            || parseFloat(this.state.amount) > this.props.approved) {
            alert(this.props.intl.formatMessage({id: "wallet.donate.amount.error"}));
            return;
        }
        if (!this.state.targetId) {
            alert(this.props.intl.formatMessage({id: "wallet.donate.cause.error"}));
            return;
        }
        try {
            let response = await createOtpRequest();
            if (response) {
                this.setState({
                    donateVisible: false,
                    otpRequestVisible: true,
                    otpType: 'DONATION'
                })
            }
        } catch (error) {
            //nothing happens, DB not working
        }
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
                <Modal visible={this.state.otpRequestVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="container cart_inner">
                        <table className="table">
                            <tbody>
                            <tr className="shipping_area">
                                <td>
                                    <div className="shipping_box">
                                        {this.state.otpType === 'CASHOUT' &&
                                            <React.Fragment>
                                                <h3 className="important-left-align">
                                                    <FormattedMessage id="wallet.block.cashout.confirm.name"
                                                                      defaultMessage="Account holder name: "/>
                                                    {this.state.name}
                                                </h3>
                                                <h3 className="important-left-align">
                                                    <FormattedMessage id="wallet.block.cashout.confirm.iban"
                                                                      defaultMessage="IBAN: "/>
                                                    {this.state.iban}
                                                </h3>
                                            </React.Fragment>
                                        }
                                        <h3 className="important-left-align">
                                            <FormattedMessage id="wallet.block.otp.mail.mesasge"
                                                              defaultMessage="A mail was sent with the code to validate the
                                                           transaction."/>
                                        </h3>
                                        <GenericInput type={InputType.NUMBER} id={"otpCode"}
                                                      handleChange={event => this.setState({otpCode: parseInt(event.target.value)})}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "wallet.block.otp.request.placeholder"})
                                                      }/>
                                        <h3>
                                            <a href={emptyHrefLink} onClick={this.creatRequest}>
                                                <i className="fa fa-thumbs-up blue-color" aria-hidden="true">
                                                    <FormattedMessage id="wallet.block.otp.proceed"
                                                                      defaultMessage="Validate "/>
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
                <Modal visible={this.state.cashoutVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="container cart_inner">
                        <table className="table">
                            <tbody>
                            <tr className="shipping_area">
                                <td>
                                    <div className="shipping_box">
                                        <FadeLoader
                                            loading={this.state.faderVisible}
                                            color={'#1641ff'}
                                            css={spinnerCss}
                                        />
                                        {!this.state.faderVisible &&
                                        <React.Fragment>
                                            <GenericInput type={InputType.TEXT} id={"name"}
                                                          handleChange={event => this.setState({name: event.target.value})}
                                                          value={this.state.name}
                                                          placeholder={
                                                              this.props.intl.formatMessage({id: "wallet.block.cashout.name"})
                                                          }/>
                                            < GenericInput type={InputType.TEXT} id={"iban"}
                                                           handleChange={event => this.setState({iban: event.target.value})}
                                                           value={this.state.iban}
                                                           placeholder={
                                                               this.props.intl.formatMessage({id: "wallet.block.cashout.iban"})
                                                           }/>

                                            <h6>
                                                <FormattedMessage id="wallet.block.available.amount"
                                                                  defaultMessage="Available amount: "/>
                                                <i className="blue-color">{this.props.approved.toFixed(1) + ' RON'}</i>
                                            </h6>
                                            <GenericInput type={InputType.NUMBER} id={'amount-text-field-cashout'}
                                                          max={this.props.approved.toString()}
                                                          handleChange={event => this.setState({amount: event.target.value})}
                                                          value={this.state.amount}
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
                                        </React.Fragment>
                                        }
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
                                        <FadeLoader
                                            loading={this.state.faderVisible}
                                            color={'#1641ff'}
                                            css={spinnerCss}
                                        />
                                        {!this.state.faderVisible &&
                                        <React.Fragment>
                                            <ul className="list">
                                                {causesList}
                                            </ul>

                                            <h6>
                                                <FormattedMessage id="wallet.block.available.amount"
                                                                  defaultMessage="Available amount: "/>
                                                <i className="blue-color">{this.props.approved.toFixed(1) + ' RON'}</i>
                                            </h6>
                                            <GenericInput type={InputType.NUMBER} id={'amount-text-field-donation'}
                                                          max={this.props.approved.toString()}
                                                          value={this.state.amount}
                                                          min={"1"}
                                                          handleChange={event => this.setState({amount: event.target.value})}
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
                                        </React.Fragment>
                                        }
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
                                                <a href={emptyHrefLink} className="btn submit_btn genric-btn circle"
                                                   onClick={() => this.openCashoutModal()}>
                                                    <FormattedMessage id="wallet.block.cashout"
                                                                      defaultMessage="Cashout"/>
                                                </a>
                                                <a href={emptyHrefLink} className="btn submit_btn genric-btn circle"
                                                   onClick={() => this.openDonateModal()}>
                                                    <FormattedMessage id="wallet.block.donate" defaultMessage="Donate"/>
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
