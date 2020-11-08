import React from "react";
import Modal from 'react-awesome-modal';
import { FormattedMessage, injectIntl, IntlShape } from "react-intl";
import { FormControlLabel } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { setLocalStorage } from "../../helper/StorageHelper";
import { emptyHrefLink, StorageKey } from "../../helper/Constants";
import { clickSaveAndRedirect } from "../../rest/ClickService";

interface RedirectModalProps {
    cashbackUrl: string,
    programId: string,
    intl: IntlShape;
    visible: boolean,
    onCloseModal: any
}

interface RedirectModalState {
    disableMessageCheckbox: boolean
}

class RedirectModal extends React.Component<RedirectModalProps, RedirectModalState> {

    constructor(props: RedirectModalProps) {
        super(props);
        this.state = {
            disableMessageCheckbox: false
        };
        this.disableRedirectMessage = this.disableRedirectMessage.bind(this);
    }

    disableRedirectMessage(event) {
        this.setState({
            disableMessageCheckbox: event.target.checked
        });
        setLocalStorage(StorageKey.REDIRECT_MESSAGE, !this.state.disableMessageCheckbox);
    }

    public render() {
        return (
            <React.Fragment>
                <Modal
                    visible={this.props.visible}
                    effect="fadeInUp"
                    onClickAway={this.props.onCloseModal}
                >
                    <div className="text-center p-4">
                        <div style={{textAlign: 'right'}}>
                            <i
                                onClick={this.props.onCloseModal}
                                className="fa fa-times"
                            />
                        </div>
                        <div style={{padding: 15, maxWidth: 300, minWidth: 300}}>
                            <h4>
                                <FormattedMessage
                                    id={'user.redirect.title'}
                                    defaultMessage="O scurtă explicație"
                                />
                            </h4>
                            <p>
                                <FormattedMessage
                                    id={'user.redirect.message'}
                                    defaultMessage="Urmează să accesezi site-ul magazinului.
                                    Acolo poți căuta și cumpăra ce dorești"
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    id={'user.redirect.message1'}
                                    defaultMessage="Site-ul va reține pentru câteva zile că ai ajuns prin intermediul
                                    CharityDiscount"
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    id={'user.redirect.message2'}
                                    defaultMessage="La scurt timp după ce ai plasat comanda dorită, cashback-ul va fi
                                    vizibil în CharityDiscount"
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    id={'user.redirect.message3'}
                                    defaultMessage="În prima fază, cashback-ul va fi în așteptare, iar după un anumit
                                    număr de zile(între 14 și 60 cel mai des), dacă nu ai returnat produsele, va fi disponibil"
                                />
                            </p>
                            <div className="switch-wrap d-flex justify-content-between">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.disableMessageCheckbox}
                                            onChange={this.disableRedirectMessage}
                                            name="redirectChecked"
                                            color="secondary"
                                        />
                                    }
                                    label={this.props.intl.formatMessage({id: 'user.redirect.checkbox'})}
                                />
                                <a
                                    href={emptyHrefLink}
                                    onClick={(event) => {clickSaveAndRedirect(event, this.props.programId, this.props.cashbackUrl)}}
                                    rel="noopener noreferrer"
                                    className="main_btn"
                                >
                                    <FormattedMessage
                                        id={'shop.access.button'}
                                        defaultMessage="Access"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

export default injectIntl(RedirectModal);