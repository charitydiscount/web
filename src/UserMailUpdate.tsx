import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { emptyHrefLink, logoPath } from "./helper/Constants";
import Modal from 'react-awesome-modal';
import { auth } from "./index";
import { TextField } from "@material-ui/core";
import { emailRegexp } from "./helper/AppHelper";
import InfoModal from "./components/modals/InfoModal";
import { FormattedMessage } from "react-intl/dist/react-intl";
import { doLogoutAction } from "./components/login/UserActions";
import { connect } from "react-redux";
import { getUserEmail, updateUserEmail } from "./rest/UserService";
import { getUserId } from "./components/login/AuthHelper";

interface UserMailUpdateProps {
    intl: IntlShape;
    logout: () => void;
}

class UserMailUpdate extends React.Component<UserMailUpdateProps> {

    state = {
        userMailUpdate: false,
        infoModalVisible: false,
        updateMailSuccess: false,
        infoModalMessage: "",
        email: "",
        errorMail: false,
        errorMailMessage: ""
    };

    async componentDidMount() {
        let userEmail = await getUserEmail(getUserId());
        if (!userEmail) {
            this.setState({
                userMailUpdate: true
            })
        }
    }

    async updateMail() {
        if (!emailRegexp.test(this.state.email)) {
            this.setState({
                errorMail: true,
                errorMailMessage: this.props.intl.formatMessage({id: 'user.mail.invalid'})
            });
            return;
        } else {
            if (auth.currentUser) {
                await auth.currentUser
                    .updateEmail(this.state.email)
                    .then(async () => {
                        await updateUserEmail(this.state.email);
                        this.setState({
                            errorMail: false,
                            errorMailMessage: "",
                            infoModalVisible: true,
                            updateMailSuccess: true,
                            infoModalMessage: this.props.intl.formatMessage({id: 'user.mail.update.success'})
                        });

                    })
                    .catch(() => {
                        this.setState({
                            errorMail: false,
                            errorMailMessage: "",
                            infoModalVisible: true,
                            infoModalMessage: this.props.intl.formatMessage({id: 'user.mail.update.error'})
                        })
                    });
            }
        }
    }

    async onCloseInfoModal() {
        if (this.state.updateMailSuccess) {
            this.setState({
                infoModalVisible: false,
                userMailUpdate: false
            });
        } else {
            await this.props.logout();
            window.location.reload();
        }
    }

    render() {
        if (this.state.userMailUpdate) {
            return (
                <React.Fragment>
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

export default connect(null, mapDispatchToProps)(injectIntl(UserMailUpdate));

