import * as React from 'react';
import {auth, store} from '../../index';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import {Stages} from '../helper/Stages';
import {emptyHrefLink, InputType} from '../../helper/Constants';
import GenericInput from '../input/GenericInput';
import {FormattedMessage} from 'react-intl';
import {injectIntl, IntlShape} from 'react-intl';
import {isEmptyString} from '../../helper/AppHelper';
import Modal from 'react-awesome-modal';
import {addContactMessageToDb} from '../../rest/ContactService';

interface IContactProps {
    intl: IntlShape;
}

interface IContactState {
    subject: string;
    message: string;
    modalVisible: boolean;
    modalMessage: string;
}

class Contact extends React.Component<IContactProps, IContactState> {
    constructor(props: IContactProps) {
        super(props);
        this.state = {
            subject: '',
            message: '',
            modalVisible: false,
            modalMessage: '',
        };
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    public componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
        store.dispatch(NavigationsAction.setStageAction(Stages.CONTACT));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CONTACT));
    }

    public async handleSendMessage(event) {
        if (!isEmptyString(this.state.subject)) {
            this.setState({
                modalVisible: true,
                modalMessage: this.props.intl.formatMessage({
                    id: 'contact.subject.wrong',
                }),
            });
            return;
        }
        if (!isEmptyString(this.state.message)) {
            this.setState({
                modalVisible: true,
                modalMessage: this.props.intl.formatMessage({
                    id: 'contact.message.wrong',
                }),
            });
            return;
        }

        if (auth.currentUser) {
            await addContactMessageToDb(
                auth.currentUser.displayName,
                auth.currentUser.email,
                auth.currentUser.uid,
                this.state.message,
                this.state.subject
            )
                .then(() => {
                    this.setState({
                        modalVisible: true,
                        modalMessage: this.props.intl.formatMessage({
                            id: 'contact.sendMessage.ok',
                        }),
                        subject: '',
                        message: '',
                    });
                })
                .catch(() => {
                    this.setState({
                        modalVisible: true,
                        modalMessage: this.props.intl.formatMessage({
                            id: 'contact.sendMessage.not.ok',
                        }),
                    });
                });
        }
    }

    public closeModal() {
        this.setState({
            modalVisible: false,
        });
    }

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.state.modalVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    {this.state.modalMessage ? (
                        <h3 style={{padding: 15}}>
                            {this.state.modalMessage}
                        </h3>
                    ) : (
                        ''
                    )}
                </Modal>
                <section className="contact_area p_120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2"/>
                            <div className="col-lg-3">
                                <div className="contact_info">
                                    <div className="info_item">
                                        <i className="fa fa-envelope"></i>
                                        <h6>
                                            <a href={emptyHrefLink}>
                                                {' '}
                                                support@mail.charitydiscount.ro
                                            </a>
                                        </h6>
                                        <p>
                                            <FormattedMessage
                                                id="contact.mail.label"
                                                defaultMessage="Send us your message anytime!"
                                            />
                                        </p>
                                    </div>
                                    <div className="info_item">
                                        <a
                                            href="https://www.facebook.com/charitydiscount"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fa fa-facebook"></i>
                                        </a>
                                        <h6>
                                            <a
                                                href="https://www.facebook.com/charitydiscount"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Charity Discount Facebook
                                            </a>
                                        </h6>
                                    </div>
                                    <br/>
                                    <div className="info_item">
                                        <a
                                            href="https://www.instagram.com/charitydiscount/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="fa fa-instagram"></i>
                                        </a>
                                        <h6>
                                            <a
                                                href="https://www.instagram.com/charitydiscount/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Charity Discount Instagram
                                            </a>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="row contact_form">
                                    <div className="col-md-9">
                                        <div className="form-group">
                                            <GenericInput
                                                className={'form-control'}
                                                placeholder={this.props.intl.formatMessage(
                                                    {id: 'contact.subject'}
                                                )}
                                                value={this.state.subject}
                                                type={InputType.TEXT}
                                                id={'subject'}
                                                handleChange={event =>
                                                    this.setState({
                                                        subject:
                                                        event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                id={'message'}
                                                value={this.state.message}
                                                onChange={event =>
                                                    this.setState({
                                                        message:
                                                        event.target.value,
                                                    })
                                                }
                                                placeholder={this.props.intl.formatMessage(
                                                    {id: 'contact.message'}
                                                )}
                                            ></textarea>
                                        </div>
                                        <div className="col-md-12 text-right">
                                            <button
                                                type="submit"
                                                value="submit"
                                                className="btn submit_btn"
                                                onClick={this.handleSendMessage}
                                            >
                                                <FormattedMessage
                                                    id="contact.send.message.button"
                                                    defaultMessage="Send Message"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default injectIntl(Contact);
