import React from 'react';
import { emptyHrefLink, logoPath } from "./helper/Constants";
import Modal from 'react-awesome-modal';
import { auth } from "./index";
import InfoModal from "./components/modals/InfoModal";
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl';
import { getUserId, getUserInfo } from "./components/login/AuthHelper";
import { FormControlLabel } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { getDisableMailNotification, updateDisableMailNotification } from "./rest/UserService";

interface FirstUserInteractionProps {
    intl: IntlShape;
}

interface FirstUserInteractionState {
    firstUserInteractionVisible: boolean,
    disableMailNotification: boolean,
    infoModalVisible: boolean,
    infoModalMessage: string
}

class FirstUserInteraction extends React.Component<FirstUserInteractionProps, FirstUserInteractionState> {

    constructor(props: FirstUserInteractionProps) {
        super(props);
        this.state = {
            firstUserInteractionVisible: false,
            disableMailNotification: false,
            infoModalVisible: false,
            infoModalMessage: ""
        };
    }

    async componentDidMount() {
        if (getUserInfo() && auth.currentUser) {
            let creationDate = new Date(getUserInfo().creationTime);
            creationDate.setMinutes(creationDate.getMinutes() + 2);
            //created in the last minute, show first user interaction
            if (creationDate > new Date()) {
                let agreementSet = await getDisableMailNotification(getUserId());
                if (agreementSet === undefined) {
                    this.setState({
                        firstUserInteractionVisible: true
                    })
                }
            }
        }
    }

    async setUserAgreement() {
        await updateDisableMailNotification(this.state.disableMailNotification)
            .then(() => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({id: 'user.first.interaction.success'})
                });
            })
    }


    render() {
        if (this.state.firstUserInteractionVisible) {
            return (
                <React.Fragment>
                    <Modal
                        visible={this.state.firstUserInteractionVisible}
                        effect="fadeInUp"
                        onClickAway={() => {
                        }}
                    >
                        <div style={{padding: 15, maxWidth: 350}}>
                            <div style={{textAlign: "center"}}>
                                <img src={logoPath} alt="" height={68} width={80}/>
                            </div>
                            <div style={{textAlign: "center", marginTop: 10}}>
                                <h4 style={{
                                    overflowWrap: "break-word"
                                }}>
                                    <FormattedMessage
                                        id={'user.first.interaction.message'}
                                        defaultMessage="Bine ai venit! Inainte de a continua mai este nevoie doar de un mic pas !"
                                    />
                                </h4>
                            </div>
                            <div className="col-md-10">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={true}
                                            checked={true}
                                            name="tosCheck"
                                            color="secondary"
                                        />
                                    }
                                    label={this.props.intl.formatMessage({id: 'tos.title'})}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={true}
                                            checked={true}
                                            name="privacyChecked"
                                            color="secondary"
                                        />
                                    }
                                    label={this.props.intl.formatMessage({id: 'privacy.title'})}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!this.state.disableMailNotification}
                                            name="agreementCheck"
                                            color="secondary"
                                            onChange={(event) => {
                                                this.setState({
                                                    disableMailNotification: !event.target.checked
                                                })
                                            }}
                                        />
                                    }
                                    label={this.props.intl.formatMessage({id: 'user.marketing.title'})}
                                />
                            </div>
                            <div style={{textAlign: 'center', marginTop: 15}}>
                                <a
                                    href={emptyHrefLink}
                                    onClick={() => {
                                        this.setUserAgreement()
                                    }}
                                    className="genric-btn info-border circle"
                                >
                                    <FormattedMessage
                                        id="user.mail.update.button"
                                        defaultMessage="Seteaza"
                                    />
                                </a>
                            </div>
                        </div>
                    </Modal>
                    <InfoModal
                        visible={this.state.infoModalVisible}
                        message={this.state.infoModalMessage}
                        onClose={() => {
                            this.setState({
                                infoModalVisible: false,
                                firstUserInteractionVisible: false
                            })
                        }}
                    />
                </React.Fragment>
            );
        }
        return null;
    }
}

export default injectIntl(FirstUserInteraction);

