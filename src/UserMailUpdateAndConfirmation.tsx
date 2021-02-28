import React from 'react';
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl';
import { emptyHrefLink, logoPath } from "./helper/Constants";
import Modal from 'react-awesome-modal';
import { auth } from "./index";
import { TextField } from "@material-ui/core";
import { emailRegexp } from "./helper/AppHelper";
import InfoModal from "./components/modals/InfoModal";
import { doLogoutAction } from "./redux/actions/UserActions";
import { connect } from "react-redux";
import {
    getUserDbInfo,
    updateUserEmail,
    UserDto
} from "./rest/UserService";
import { getUserId } from "./components/pages/login/AuthHelper";

interface UserMailUpdateProps {
    intl: IntlShape;
    logout: () => void;
}

class UserMailUpdateAndConfirmation extends React.Component<UserMailUpdateProps> {

    state = {
        userMailUpdate: false,
        infoModalVisible: false,
        infoModalMessage: "",
        confirmationModalVisible: false,
        confirmationFailed: false,
        email: "",
        errorMail: false,
        errorMailMessage: ""
    };

    async componentDidMount() {
        if (getUserId() && auth.currentUser) {
            let userInfo = await getUserDbInfo(getUserId()) as UserDto;
            //case when user don't have an email in our DB at all
            if (userInfo !== undefined && userInfo.email !== undefined && !userInfo.email) {
                this.setState({
                    userMailUpdate: true
                })
                //related to first case, after mail is set, confirm it
            } else if (userInfo !== undefined && userInfo.needsMailConfirmation && !auth.currentUser.emailVerified) {
                this.setState({
                    confirmationModalVisible: true
                })
                //case for mail login, confirm selected mail
            } else if (auth.currentUser.providerData[0] &&
                auth.currentUser.providerData[0].providerId === "password" &&
                !auth.currentUser.emailVerified) {
                this.setState({
                    confirmationModalVisible: true
                })
            }
        }
    }

    tryAnotherMail() {
        this.setState({
            userMailUpdate: true,
            confirmationModalVisible: false
        })
    }

    async updateMail() {
        if (!emailRegexp.test(this.state.email)) {
            this.setState({
                errorMail: true,
                errorMailMessage: this.props.intl.formatMessage({id: 'user.mail.invalid'})
            });
        } else {
            if (auth.currentUser) {
                let dbMailUpdated;
                await auth.currentUser
                    .updateEmail(this.state.email)
                    .then(async () => {
                        await updateUserEmail(this.state.email);
                        dbMailUpdated = true;
                    })
                    .catch((error) => {
                        this.setState({
                            errorMail: false,
                            errorMailMessage: "",
                            infoModalVisible: true,
                            infoModalMessage: this.props.intl.formatMessage({id: 'user.mail.update.error'}) + error.message
                        })
                    });
                if (dbMailUpdated) {
                    await this.sendConfirmationMailForUser();
                }
            }
        }
    }


    async sendConfirmationMailForUser() {
        if (auth.currentUser) {
            await auth.currentUser.sendEmailVerification()
                .then(() => {
                        this.setState({
                            errorMail: false,
                            errorMailMessage: "",
                            infoModalVisible: true,
                            infoModalMessage: this.props.intl.formatMessage({id: 'user.mail.confirmation.send.success'})
                        })
                    }
                ).catch((error) => {
                        this.setState({
                            errorMail: false,
                            errorMailMessage: "",
                            confirmationFailed: true,
                            infoModalVisible: true,
                            infoModalMessage: this.props.intl.formatMessage({id: 'user.mail.confirmation.send.error'}) + error.message
                        })
                    }
                )
        }
    }

    async onCloseInfoModal() {
        if (this.state.confirmationFailed) {
            this.setState({
                confirmationModalVisible: true,
                infoModalVisible: false,
                userMailUpdate: false
            })
        } else {
            await this.props.logout();
            window.location.reload();
        }
    }

    render() {
        if (this.state.userMailUpdate || this.state.confirmationModalVisible) {
            return (
                <React.Fragment>
                    <Modal
                        visible={this.state.confirmationModalVisible}
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
                                        id="user.mail.confirmation"
                                        defaultMessage="Apasă pe link-ul de confirmare primit pe mail pentru a putea folosi sistemul"
                                    />
                                </h4>
                            </div>
                            <div style={{textAlign: 'center', marginTop: 15}}>
                                <a
                                    href={emptyHrefLink}
                                    onClick={() => this.tryAnotherMail()}
                                    className="genric-btn info-border circle"
                                    style={{width: 250}}
                                >
                                    <FormattedMessage
                                        id="user.mail.confirmation.another.mail.button"
                                        defaultMessage="Seteaza alt mail"
                                    />
                                </a>
                            </div>
                            <div style={{textAlign: 'center', marginTop: 5}}>
                                <a
                                    href={emptyHrefLink}
                                    onClick={() => {
                                        this.sendConfirmationMailForUser();
                                    }}
                                    className="genric-btn info-border circle"
                                    style={{width: 250}}
                                >
                                    <FormattedMessage
                                        id="user.mail.confirmation.try.again.button"
                                        defaultMessage="Trimite mail-ul din nou"
                                    />
                                </a>
                            </div>
                            <div style={{textAlign: 'center', marginTop: 5}}>
                                <a
                                    href={emptyHrefLink}
                                    onClick={() => {
                                        window.location.reload();
                                    }}
                                    className="genric-btn info-border circle"
                                    style={{width: 250}}
                                >
                                    <FormattedMessage
                                        id="user.mail.confirmation.already.confirmed.button"
                                        defaultMessage="Am confirmat deja"
                                    />
                                </a>
                            </div>
                            <div style={{textAlign: 'center', marginTop: 5}}>
                                <a
                                    href={emptyHrefLink}
                                    onClick={async () => {
                                        await this.props.logout();
                                        window.location.reload();
                                    }}
                                    className="genric-btn info-border circle"
                                    style={{width: 250}}
                                >
                                    <FormattedMessage
                                        id="navigation.logout"
                                        defaultMessage="Logout"
                                    />
                                </a>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        visible={this.state.userMailUpdate}
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
                                        id="user.mail.message"
                                        defaultMessage="Pentru a putea folosi aplicatia in continuare trebuie sa introduci un mail
                                    care va fi folosit la autorizarea tranzactiilor"
                                    />
                                </h4>
                                <TextField
                                    id={"email"}
                                    variant="filled"
                                    style={{
                                        width: '100%',
                                    }}
                                    label={this.props.intl.formatMessage({id: 'user.mail.label'})}
                                    error={this.state.errorMail}
                                    helperText={this.state.errorMailMessage}
                                    onChange={event => {
                                        this.setState({
                                            email: event.target.value
                                        })
                                    }
                                    }
                                    value={this.state.email}
                                />
                            </div>
                            <div style={{textAlign: 'center', marginTop: 15}}>
                                <a
                                    href={emptyHrefLink}
                                    onClick={() => this.updateMail()}
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
                            this.onCloseInfoModal()
                        }}
                    />
                </React.Fragment>
            );
        }
        return null;
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(doLogoutAction()),
    };
};

export default connect(null, mapDispatchToProps)(injectIntl(UserMailUpdateAndConfirmation));

