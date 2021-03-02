import * as React from 'react';
import { store } from '../../../index';
import { NavigationsAction } from '../../../redux/actions/NavigationsAction';
import { Stages } from '../../helper/Stages';
import { InputType } from '../../../helper/Constants';
import GenericInput from '../../input/GenericInput';
import { FormattedMessage } from 'react-intl';
import { injectIntl, IntlShape } from 'react-intl';
import { isEmptyString } from '../../../helper/AppHelper';
import { addContactMessageToDb } from '../../../rest/ContactService';
import InfoModal from "../../modals/InfoModal";
import { getUserInfo } from "../login/AuthHelper";
import { useEffect, useState } from "react";

interface IContactProps {
    intl: IntlShape;
}

interface ContactModal {
    modalVisible: boolean,
    modalMessage: string
}

const Contact = (props: IContactProps) => {

    const [modalState, setModalState] = useState<ContactModal>({modalVisible: false, modalMessage: ''});
    const [message, setMessage] = useState<string>('');
    const [subject, setSubject] = useState<string>('');

    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.code === "Escape") {
                closeModal();
            }
        }, false);
        store.dispatch(NavigationsAction.setStageAction(Stages.CONTACT));
    }, [])

    const handleSendMessage = async () => {
        if (!isEmptyString(subject)) {
            setModalState(
                {
                    modalVisible: true,
                    modalMessage: props.intl.formatMessage({id: 'contact.subject.wrong'})
                }
            )
            return;
        }
        if (!isEmptyString(message)) {
            setModalState(
                {
                    modalVisible: true,
                    modalMessage: props.intl.formatMessage({id: 'contact.message.wrong'})
                }
            )
            return;
        }

        let currentUser = getUserInfo();
        return addContactMessageToDb(currentUser.displayName, currentUser.email, currentUser.uid, message, subject)
            .then(() => {
                setModalState(
                    {
                        modalVisible: true,
                        modalMessage: props.intl.formatMessage({id: 'contact.sendMessage.ok'})
                    }
                )
                setMessage('');
                setSubject('');
            })
            .catch(() => {
                setModalState(
                    {
                        modalVisible: true,
                        modalMessage: props.intl.formatMessage({id: 'contact.sendMessage.not.ok'})
                    }
                )
            });
    }

    const closeModal = () => {
        setModalState(
            {
                modalVisible: false,
                modalMessage: ''
            }
        )
    }

    return (
        <React.Fragment>
            <InfoModal visible={modalState.modalVisible}
                       message={modalState.modalMessage}
                       onClose={closeModal}/>
            <section className="contact_area p_90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2"/>
                        <div className="col-lg-3">
                            <div className="contact_info">
                                <div className="info_item">
                                    <i className="fa fa-envelope"></i>
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
                                            placeholder={props.intl.formatMessage(
                                                {id: 'contact.subject'}
                                            )}
                                            value={subject}
                                            type={InputType.TEXT}
                                            id={'subject'}
                                            handleChange={event =>
                                                setSubject(event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                id={'message'}
                                                value={message}
                                                onChange={event => setMessage(event.target.value)}
                                                placeholder={props.intl.formatMessage(
                                                    {id: 'contact.message'}
                                                )}
                                            ></textarea>
                                    </div>
                                    <div className="col-md-12 text-right">
                                        <button
                                            type="submit"
                                            value="submit"
                                            className="btn submit_btn genric-btn circle"
                                            onClick={handleSendMessage}
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

export default injectIntl(Contact);
