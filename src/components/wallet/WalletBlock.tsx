import * as React from 'react';
import { emptyHrefLink, StorageKey, TxType } from '../../helper/Constants';
import Modal from 'react-awesome-modal';
import { CauseDto } from '../../rest/CauseService';
import CauseDonate from './CauseDonate';
import {
    createOtpRequest,
    createRequest,
    validateOtpCode,
} from '../../rest/WalletService';
import { FormattedMessage } from 'react-intl';
import { injectIntl, IntlShape } from 'react-intl';
import { emptyBackgroundCss, roundMoney } from '../../helper/AppHelper';
import FadeLoader from 'react-spinners/FadeLoader';
import {
    AccountDto,
    getUserBankAccounts,
    updateUserAccount,
} from '../../rest/UserService';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { connect } from 'react-redux';
import { auth } from '../..';
import iban from 'iban';
import { removeLocalStorage } from '../../helper/StorageHelper';

interface IWalletBlockState {
    donateVisible: boolean;
    cashoutVisible: boolean;
    otpRequestVisible: boolean;
    otpRequestValidateVisible: boolean;
    txType: string;
    otpCode?: number;

    //cashout/donate selection
    selections: boolean[];
    amount: string;
    name: string;
    iban: string;
    targetId: string;
    faderVisible: boolean;
}

interface IWalletBlockProps {
    title: String;
    approved: number;
    pending?: number;
    pendingExists?: boolean;
    money: boolean;
    causes?: CauseDto[];
    openDonateWithCaseId?: string;
    intl: IntlShape;
    onTxCompleted?: Function;
}

class WalletBlock extends React.Component<IWalletBlockProps,
    IWalletBlockState> {
    private firstTxEventReceived: boolean;

    constructor(props: IWalletBlockProps) {
        super(props);
        this.state = {
            cashoutVisible: false,
            donateVisible: false,
            otpRequestVisible: false,
            otpRequestValidateVisible: false,
            txType: '',
            otpCode: undefined,
            amount: '',
            targetId: '',
            name: '',
            iban: '',
            selections: [],
            faderVisible: false,
        };
        this.onChildUpdate = this.onChildUpdate.bind(this);
        this.donate = this.donate.bind(this);
        this.cashout = this.cashout.bind(this);
        this.creatRequest = this.creatRequest.bind(this);
        this.escFunction = this.escFunction.bind(this);
        this.firstTxEventReceived = false;
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    componentDidMount() {
        if (this.props.openDonateWithCaseId) {
            let selections = [] as boolean[];
            selections[this.props.openDonateWithCaseId] = true;

            this.setState({
                targetId: this.props.openDonateWithCaseId,
                selections: selections,
                donateVisible: true,
            });
        }
        document.addEventListener('keydown', this.escFunction, false);
    }

    openDonateModal() {
        this.setState({
            cashoutVisible: false,
            donateVisible: true,
        });
    }

    async openCashoutModal() {
        if (!auth.currentUser) {
            return;
        }
        try {
            let accounts = await getUserBankAccounts(auth.currentUser.uid);
            if (accounts && accounts.length > 0) {
                this.setState({
                    name: (accounts[0] as AccountDto).name,
                    iban: (accounts[0] as AccountDto).iban,
                });
            }
        } catch (error) {
            //account info not loaded
        }

        this.setState({
            cashoutVisible: true,
            donateVisible: false,
        });
    }

    closeModal() {
        this.setState({
            cashoutVisible: false,
            donateVisible: false,
            otpRequestVisible: false,
            otpRequestValidateVisible: false,
            txType: '',
            otpCode: undefined,
            amount: '',
            targetId: '',
            name: '',
            iban: '',
            selections: [],
        });
    }

    async creatRequest() {
        if (!this.state.otpCode) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.block.otp.code.error',
                })
            );
            return;
        }

        try {
            let response = await validateOtpCode(this.state.otpCode);
            const target =
                this.state.txType === TxType.DONATION
                    ? {
                        id: this.state.targetId,
                        name:
                            this.props.causes?.find(
                                c => c.id === this.state.targetId
                            )?.details.title || '',
                    }
                    : {
                        id: this.state.iban,
                        name: this.state.name,
                    };
            if (response) {
                try {
                    this.setState({
                        otpRequestValidateVisible: true,
                    });
                    await this.handleTxRequest(
                        parseFloat(this.state.amount),
                        this.state.txType,
                        target
                    );
                } catch (error) {
                    this.setState({
                        otpRequestValidateVisible: false,
                    });
                }
            } else {
                alert(
                    this.props.intl.formatMessage({
                        id: 'wallet.block.otp.code.worng.error',
                    })
                );
            }
        } catch (error) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.block.otp.code.worng.error',
                })
            );
        }
    }

    async handleTxRequest(
        amount: number,
        txType: string,
        target: { id: string; name: string }
    ) {
        this.setState({
            faderVisible: true,
        });
        if (txType === 'DONATION') {
            removeLocalStorage(StorageKey.CAUSES);
        }
        let txResult = await createRequest(amount, txType, target);
        const unsubscribe = txResult.onSnapshot(snap => {
            // There should be events fired
            // 1st when the request is created
            // 2nd after it is processed
            if (!this.firstTxEventReceived) {
                this.firstTxEventReceived = true;
            } else {
                unsubscribe();
                this.closeModal();
                this.setState({
                    faderVisible: false,
                });
                if (this.props.onTxCompleted) {
                    this.props.onTxCompleted();
                }
            }
        });
    }

    async cashout() {
        if (
            !this.state.amount ||
            this.state.amount.length < 1 ||
            parseFloat(this.state.amount) < 50
        ) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.cashout.amount.error',
                })
            );
            return;
        }

        if (roundMoney(parseFloat(this.state.amount)) > roundMoney(this.props.approved)) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.cashout.no.amount.error',
                })
            );
            return;
        }

        if (!this.state.name) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.cashout.name.error',
                })
            );
            return;
        }

        if (!this.state.iban || !iban.isValid(this.state.iban)) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.cashout.iban.error',
                })
            );
            return;
        }

        try {
            await updateUserAccount(this.state.name, this.state.iban);
        } catch (error) {
            //nothing happens, DB not working
        }

        try {
            this.setState({
                faderVisible: true,
            });

            await createOtpRequest();
            this.setState({
                faderVisible: false,
                cashoutVisible: false,
                otpRequestVisible: true,
                txType: 'CASHOUT',
            });
        } catch (error) {
            this.setState({
                faderVisible: false,
            });
            //nothing happens, DB not working
        }
    }

    async donate() {
        if (
            !this.state.amount ||
            this.state.amount.length < 1 ||
            parseFloat(this.state.amount) < 1
        ) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.donate.amount.error',
                })
            );
            return;
        }

        if (roundMoney(parseFloat(this.state.amount)) > roundMoney(this.props.approved)) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.cashout.no.amount.error',
                })
            );
            return;
        }

        if (!this.state.targetId) {
            alert(
                this.props.intl.formatMessage({
                    id: 'wallet.donate.cause.error',
                })
            );
            return;
        }
        try {
            await this.handleTxRequest(
                parseFloat(this.state.amount),
                TxType.DONATION,
                {
                    id: this.state.targetId,
                    name:
                        this.props.causes?.find(
                            c => c.id === this.state.targetId
                        )?.details.title || '',
                }
            );
        } catch (error) {
            this.setState({
                faderVisible: false,
            });
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
            selections: selections,
        });
    }

    public render() {
        const causesList = this.props.causes
            ? this.props.causes.map(cause => {
                return (
                    <CauseDonate
                        key={cause.id}
                        id={cause.id}
                        causeTitle={cause.details.title}
                        onUpdate={this.onChildUpdate}
                        selections={this.state.selections}
                    />
                );
            })
            : null;

        return (
            <React.Fragment>
                <Modal
                    visible={this.state.otpRequestVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    {this.state.otpRequestVisible && (
                        <div className="container cart_inner">
                            <table className="table">
                                <tbody>
                                <tr className="shipping_area">
                                    <td>
                                        <div className="shipping_box">
                                            {this.state.txType ===
                                            'CASHOUT' && (
                                                <React.Fragment>
                                                    <h3 className="important-left-align">
                                                        <FormattedMessage
                                                            id="wallet.block.cashout.confirm.name"
                                                            defaultMessage="Account holder name: "
                                                        />
                                                        {this.state.name}
                                                    </h3>
                                                    <h3 className="important-left-align">
                                                        <FormattedMessage
                                                            id="wallet.block.cashout.confirm.iban"
                                                            defaultMessage="IBAN: "
                                                        />
                                                        {this.state.iban}
                                                    </h3>
                                                </React.Fragment>
                                            )}
                                            <h3 className="important-left-align">
                                                <FormattedMessage
                                                    id="wallet.block.otp.mail.mesasge"
                                                    defaultMessage="A mail was sent with the code to validate the
                                                           transaction."
                                                />
                                            </h3>

                                            <TextField
                                                id="otpCode"
                                                variant="filled"
                                                style={{width: '100%'}}
                                                label={this.props.intl.formatMessage(
                                                    {
                                                        id:
                                                            'wallet.block.otp.request.placeholder',
                                                    }
                                                )}
                                                onChange={event =>
                                                    this.setState({
                                                        otpCode: parseInt(
                                                            event.target
                                                                .value
                                                        ),
                                                    })
                                                }
                                                value={this.state.otpCode}
                                            />

                                            <div className="p_05">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={
                                                        this.creatRequest
                                                    }
                                                    startIcon={
                                                        <ThumbUpAltIcon/>
                                                    }
                                                >
                                                    <FormattedMessage
                                                        id="wallet.block.otp.proceed"
                                                        defaultMessage="Validate "
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal>
                <Modal
                    visible={this.state.cashoutVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <FadeLoader
                        loading={this.state.faderVisible}
                        color={'#ffffff'}
                        css={emptyBackgroundCss}
                    />
                    {!this.state.faderVisible && (
                        <div className="container cart_inner">
                            <table className="table">
                                <tbody>
                                <tr className="shipping_area">
                                    <td>
                                        <div className="shipping_box">
                                            <React.Fragment>
                                                <TextField
                                                    id="name"
                                                    label={this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'wallet.block.cashout.name',
                                                        }
                                                    )}
                                                    onChange={event =>
                                                        this.setState({
                                                            name:
                                                            event.target
                                                                .value,
                                                        })
                                                    }
                                                    variant="filled"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    value={this.state.name}
                                                />
                                                <TextField
                                                    id="iban"
                                                    variant="filled"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    label={this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'wallet.block.cashout.iban',
                                                        }
                                                    )}
                                                    onChange={event =>
                                                        this.setState({
                                                            iban:
                                                            event.target
                                                                .value,
                                                        })
                                                    }
                                                    value={this.state.iban}
                                                />

                                                <h6>
                                                    <FormattedMessage
                                                        id="wallet.block.available.amount"
                                                        defaultMessage="Available amount: "
                                                    />
                                                    <i className="blue-color">
                                                        {roundMoney(
                                                            this.props
                                                                .approved
                                                        ) + ' RON'}
                                                    </i>
                                                </h6>
                                                <h6>
                                                    <FormattedMessage
                                                        id="wallet.block.minimum.amount"
                                                        defaultMessage="Minimum amount: "
                                                    />
                                                    <i className="blue-color">
                                                        {'50 RON'}
                                                    </i>
                                                </h6>

                                                <TextField
                                                    id="amount-text-field-cashout"
                                                    type="number"
                                                    variant="filled"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    inputProps={{
                                                        min: '50',
                                                        step: '0.01',
                                                    }}
                                                    label={this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'wallet.table.amount',
                                                        }
                                                    )}
                                                    onChange={event =>
                                                        this.setState({
                                                            amount:
                                                            event.target
                                                                .value,
                                                        })
                                                    }
                                                    value={
                                                        this.state.amount
                                                    }
                                                />

                                                <div className="p_05">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={
                                                            this.cashout
                                                        }
                                                        startIcon={
                                                            <AttachMoneyIcon/>
                                                        }
                                                    >
                                                        <FormattedMessage
                                                            id="wallet.block.cashout"
                                                            defaultMessage="Cashout "
                                                        />
                                                    </Button>
                                                </div>
                                            </React.Fragment>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal>
                <Modal
                    visible={this.state.donateVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <FadeLoader
                        loading={this.state.faderVisible}
                        color={'#ffffff'}
                        css={emptyBackgroundCss}
                    />
                    {!this.state.faderVisible && (
                        <div className="container cart_inner">
                            <table className="table">
                                <tbody>
                                <tr className="shipping_area">
                                    <td>
                                        <div className="shipping_box">
                                            <React.Fragment>
                                                <ul className="list">
                                                    {causesList}
                                                </ul>

                                                <h6>
                                                    <FormattedMessage
                                                        id="wallet.block.available.amount"
                                                        defaultMessage="Available amount: "
                                                    />
                                                    <i className="blue-color">
                                                        {roundMoney(
                                                            this.props
                                                                .approved
                                                        ) + ' RON'}
                                                    </i>
                                                </h6>

                                                <TextField
                                                    id="amount-text-field-donation"
                                                    type="number"
                                                    variant="filled"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    inputProps={{
                                                        step: '0.01',
                                                    }}
                                                    label={this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'wallet.table.amount',
                                                        }
                                                    )}
                                                    onChange={event =>
                                                        this.setState({
                                                            amount:
                                                            event.target
                                                                .value,
                                                        })
                                                    }
                                                    value={
                                                        this.state.amount
                                                    }
                                                />

                                                <div className="p_05">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={
                                                            this.donate
                                                        }
                                                        startIcon={
                                                            <FavoriteBorderIcon/>
                                                        }
                                                    >
                                                        <FormattedMessage
                                                            id="wallet.block.donate"
                                                            defaultMessage="Donate "
                                                        />
                                                    </Button>
                                                </div>
                                            </React.Fragment>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal>

                <Modal
                    visible={this.state.otpRequestValidateVisible}
                    effect="fadeInUp"
                >
                    <FadeLoader
                        loading={this.state.otpRequestValidateVisible}
                        color={'#ffffff'}
                        css={emptyBackgroundCss}
                    />
                </Modal>
                <div className="col-lg-6 total_rate">
                    <div className="box_total">
                        <h5>{this.props.title}</h5>
                        <h4>
                            {this.props.approved
                                ? roundMoney(this.props.approved)
                                : 0}
                        </h4>
                        {this.props.pendingExists ? (
                            <div>
                                <h6>
                                    <FormattedMessage
                                        id="wallet.block.pending"
                                        defaultMessage="Pending:"
                                    />
                                    {this.props.pending
                                        ? roundMoney(this.props.pending) +
                                        ' RON'
                                        : 0}
                                </h6>
                                {this.props.money ? (
                                    <div>
                                        <div>
                                            <br/>
                                            <a
                                                href={emptyHrefLink}
                                                className="btn submit_btn genric-btn circle m-2"
                                                onClick={() =>
                                                    this.openCashoutModal()
                                                }
                                            >
                                                <FormattedMessage
                                                    id="wallet.block.cashout"
                                                    defaultMessage="Cashout"
                                                />
                                            </a>
                                            <a
                                                href={emptyHrefLink}
                                                className="btn submit_btn genric-btn circle m-2"
                                                onClick={() =>
                                                    this.openDonateModal()
                                                }
                                            >
                                                <FormattedMessage
                                                    id="wallet.block.donate"
                                                    defaultMessage="Donate"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect()(injectIntl(WalletBlock));
