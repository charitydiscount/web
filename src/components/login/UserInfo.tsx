import { auth, storage, store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import * as React from 'react';
import {
    emptyHrefLink, profilePictureDefaultName, StorageRef,
} from '../../helper/Constants';
import { doLogoutAction, updateUserPhoto } from '../../redux/actions/UserActions';
import { connect } from 'react-redux';
import FileUploader from 'react-firebase-file-uploader';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { addDefaultImgSrc, getImagePath, spinnerCss } from '../../helper/AppHelper';
import FadeLoader from 'react-spinners/FadeLoader';
import { Routes } from '../helper/Routes';
import { Link } from 'react-router-dom';
import InfoModal from '../modals/InfoModal';
import ConfirmModal from '../modals/ConfimModal';
import {
    getUserDbInfo,
    updateDisableMailNotification, updateUserPhotoUrl, updateUserPrivateName, updateUserPrivatePhoto, UserDto,
} from '../../rest/UserService';
import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { getUserId, UserInfoDto } from './AuthHelper';
import OtpModal from "../modals/OtpModal";
import { createOtpRequest, validateOtpCode } from "../../rest/WalletService";
import { fetchProfilePhoto } from "../../rest/StorageService";

interface IUserInfoProps {
    intl: IntlShape;
    logout: () => void;
    updateUserPhoto: (photoUrl: string) => void,
    userInfo: UserInfoDto
}

interface IUserInfoState {
    infoModalVisible: boolean;
    infoModalMessage: string;
    confirmModalVisible: boolean;
    confirmModalMessage: string;
    otpModalVisible: boolean,
    deleteAccount: boolean;
    accountDeleted: boolean;
    isLoading: boolean;
    disableMailNotification: Boolean;
    privateName: boolean;
    privatePhoto: boolean
}

class UserInfo extends React.Component<IUserInfoProps, IUserInfoState> {

    constructor(props: IUserInfoProps) {
        super(props);
        this.state = {
            infoModalVisible: false,
            infoModalMessage: '',
            confirmModalVisible: false,
            confirmModalMessage: '',
            otpModalVisible: false,
            isLoading: true,
            deleteAccount: false,
            accountDeleted: false,
            disableMailNotification: false,
            privateName: false,
            privatePhoto: false
        };
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.closeInfoModal();
            this.closeConfirmModal();
            this.closeOtpModal();
        }
    };

    async componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
        store.dispatch(NavigationsAction.setStageAction(Stages.USER));

        let response = await getUserDbInfo(getUserId()) as UserDto;
        if (response) {
            this.setState({
                disableMailNotification: response.disableMailNotification,
                privateName: response.privateName,
                privatePhoto: response.privatePhoto,
                isLoading: false
            });
        }
    }

    updatePrivateName = async (event) => {
        let checked = event.target.checked;
        await updateUserPrivateName(checked)
            .then(() => {
                this.setState({
                    privateName: checked,
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({
                        id: checked
                            ? 'user.private.name.success.true'
                            : 'user.private.name.success.false',
                    }),
                });
            })
            .catch((error) => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({id: 'user.disable.mail.notification.error'})
                });
            });
    };

    updatePrivatePhoto = async (event) => {
        let checked = event.target.checked;
        await updateUserPrivatePhoto(checked)
            .then(() => {
                this.setState({
                    privatePhoto: checked,
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({
                        id: checked
                            ? 'user.private.photo.success.true'
                            : 'user.private.photo.success.false',
                    }),
                });
            })
            .catch((error) => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({id: 'user.disable.mail.notification.error'})
                });
            });
    };

    updateMailNotification = async (event) => {
        let checked = event.target.checked;
        await updateDisableMailNotification(!checked)
            .then(() => {
                this.setState({
                    disableMailNotification: !checked,
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({
                        id: !checked
                            ? 'user.disable.mail.notification.success.true'
                            : 'user.disable.mail.notification.success.false',
                    }),
                });
            })
            .catch((error) => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({id: 'user.disable.mail.notification.error'})
                });
            });
    };

    componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
    }

    sendOtpRequest = async () => {
        this.setState({
            confirmModalVisible: false
        });

        await createOtpRequest();
        this.setState({
            otpModalVisible: true
        });
    };

    onOtpValidate = async (otpCode) => {
        if (!otpCode) {
            this.setState({
                infoModalVisible: true,
                infoModalMessage: this.props.intl.formatMessage({id: 'otp.code.empty'})
            });
            return;
        }
        try {
            let response = await validateOtpCode(parseInt(otpCode));
            if (response) {
                if (auth.currentUser) {
                    try {
                        this.setState({
                            isLoading: true,
                            otpModalVisible: false
                        });
                        await auth.currentUser.delete();
                    } catch (e) {
                        this.setState({
                            isLoading: false,
                            infoModalVisible: true,
                            infoModalMessage: this.props.intl.formatMessage({id: 'userInfo.delete.account.not.ok.reason'}) + e.message
                        });
                    }
                }
            } else {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: this.props.intl.formatMessage({id: 'otp.code.wrong'})
                });
            }
        } catch (error) {
            this.setState({
                infoModalVisible: true,
                infoModalMessage: this.props.intl.formatMessage({id: 'otp.code.wrong'})
            });
        }
    };

    handleLogOut = (event: any) => {
        event.preventDefault();
        this.props.logout();
    };

    showPasswordResetResult = (success) => {
        this.setState({
            isLoading: false,
            infoModalVisible: true,
            infoModalMessage: success
                ? this.props.intl.formatMessage({
                    id: 'userInfo.email.reset.sent',
                })
                : this.props.intl.formatMessage({
                    id: 'userInfo.email.reset.error',
                }),
        });
    };

    passwordResetEmail = () => {
        this.setState({
            confirmModalVisible: false,
            isLoading: true,
        });
        if (this.props.userInfo.email) {
            auth.sendPasswordResetEmail(this.props.userInfo.email)
                .then(
                    () => this.showPasswordResetResult(true) // Password reset email sent.
                )
                .catch(() => this.showPasswordResetResult(false));
        }
    };

    closeConfirmModal = () => {
        this.setState({
            confirmModalVisible: false
        });
    };

    closeInfoModal = () => {
        this.setState({
            infoModalVisible: false
        });
    };

    closeOtpModal = () => {
        this.setState({
            otpModalVisible: false
        });
    };

    handleUploadSuccess = async () => {
        const response = await fetchProfilePhoto(getUserId());
        //update in auth
        await auth.currentUser.updateProfile(
            {photoURL: response as string}
        );
        //update in users
        await updateUserPhotoUrl(response as string);

        this.setState({
            infoModalVisible: true,
            infoModalMessage: this.props.intl.formatMessage({
                id: 'userInfo.profile.picture.uploaded',
            }),
        });
        this.props.updateUserPhoto(response as string);
    };

    handleUploadError = () => {
        this.setState({
            infoModalVisible: true,
            infoModalMessage: this.props.intl.formatMessage({
                id: 'userInfo.profile.picture.error',
            }),
        });
    };

    public render() {
        let disableChecked = true;
        if (this.state.disableMailNotification) {
            disableChecked = false;
        }

        return (
            <React.Fragment>
                <FadeLoader
                    loading={this.state.isLoading}
                    color={'#e31f29'}
                    css={spinnerCss}
                />
                <OtpModal visible={this.state.otpModalVisible}
                          onValidate={this.onOtpValidate}
                          onClose={this.closeOtpModal}
                />
                <InfoModal
                    visible={this.state.infoModalVisible}
                    message={this.state.infoModalMessage}
                    onClose={this.closeInfoModal}
                />
                <ConfirmModal
                    visible={this.state.confirmModalVisible}
                    message={this.state.confirmModalMessage}
                    onSave={() => {
                        if (this.state.deleteAccount) {
                            return this.sendOtpRequest();
                        }
                        return this.passwordResetEmail();
                    }}
                    onClose={this.closeConfirmModal}
                />
                {!this.state.isLoading && (
                    <div className="product_image_area">
                        <div className="container p_90">
                            <div className="row s_product_inner">
                                <div className="col-lg-3"/>
                                <div className="col-lg-4">
                                    <div className="s_product_img">
                                        <div className="blog_right_sidebar">
                                            <aside className="single_sidebar_widget author_widget">
                                                <img
                                                    className="author_img rounded-circle"
                                                    src={getImagePath(this.props.userInfo.photoURL)}
                                                    alt="Missing"
                                                    width={200}
                                                    height={200}
                                                    onError={addDefaultImgSrc}
                                                />
                                                <h4>
                                                    {this.props.userInfo.displayName}
                                                </h4>
                                                <p>{this.props.userInfo.email}</p>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                this.state.privateName
                                                            }
                                                            onChange={this.updatePrivateName}
                                                            name="redirectChecked"
                                                            color="secondary"
                                                        />
                                                    }
                                                    label={this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'user.private.name',
                                                        }
                                                    )}
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                this.state.privatePhoto
                                                            }
                                                            onChange={this.updatePrivatePhoto}
                                                            name="redirectChecked"
                                                            color="secondary"
                                                        />
                                                    }
                                                    label={this.props.intl.formatMessage(
                                                        {
                                                            id:
                                                                'user.private.photo',
                                                        }
                                                    )}
                                                />
                                                <div className="br"/>
                                                <h4>
                                                    <FormattedMessage
                                                        id="user.marketing.title"
                                                        defaultMessage="Acord de marketing"
                                                    />
                                                </h4>
                                                <div style={{marginLeft: 15}}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={
                                                                    disableChecked
                                                                }
                                                                onChange={this.updateMailNotification}
                                                                name="redirectChecked"
                                                                color="secondary"
                                                            />
                                                        }
                                                        label={this.props.intl.formatMessage(
                                                            {
                                                                id:
                                                                    'user.disable.mail.notification',
                                                            }
                                                        )}
                                                    />
                                                </div>
                                            </aside>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-3"
                                    style={{minWidth: 'fit-content'}}
                                >
                                    <div className="blog_right_sidebar">
                                        <aside className="single_sidebar_widget popular_post_widget">
                                            <div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={emptyHrefLink}
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                    >
                                                        <label
                                                            style={{
                                                                marginBottom: 0,
                                                                minWidth:
                                                                    '100%',
                                                                borderRadius: 20,
                                                                cursor:
                                                                    'pointer',
                                                            }}
                                                        >
                                                            <FormattedMessage
                                                                id="userinfo.upload.button"
                                                                defaultMessage="Upload photo"
                                                            />
                                                            <FileUploader
                                                                hidden
                                                                accept="image/*"
                                                                filename={
                                                                    profilePictureDefaultName
                                                                }
                                                                storageRef={storage.ref(
                                                                    StorageRef.PROFILE_PHOTOS +
                                                                    this.props.userInfo.uid
                                                                )}
                                                                onUploadError={this.handleUploadError}
                                                                onUploadSuccess={this.handleUploadSuccess}
                                                                onUploadStart={() => {
                                                                }}
                                                            />
                                                        </label>
                                                    </a>
                                                </div>
                                                {this.props.userInfo.normalUser && (
                                                    <div className="col-md-12 text-center p_05">
                                                        <a
                                                            href={emptyHrefLink}
                                                            onClick={
                                                                () => {
                                                                    this.setState({
                                                                        deleteAccount: false,
                                                                        confirmModalVisible: true,
                                                                        confirmModalMessage: this.props.intl.formatMessage({id: 'userInfo.email.reset.confirm'})
                                                                    });
                                                                }
                                                            }
                                                            className="btn submit_btn userInfo_btn genric-btn circle"
                                                        >
                                                            <FormattedMessage
                                                                id="userinfo.change.password.button"
                                                                defaultMessage="Change password"
                                                            />
                                                        </a>
                                                    </div>
                                                )}
                                                <div className="br"/>
                                            </div>

                                            <div className="col-md-12 text-center p_05">
                                                <Link
                                                    to={Routes.CONTACT}
                                                    className="btn submit_btn userInfo_btn genric-btn circle"
                                                >
                                                    <FormattedMessage
                                                        id="userinfo.contact.us.button"
                                                        defaultMessage="Contact us"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <Link
                                                    to={Routes.TOS}
                                                    className="btn submit_btn userInfo_btn genric-btn circle"
                                                >
                                                    <FormattedMessage
                                                        id="userinfo.terms.button"
                                                        defaultMessage="Terms of agreement"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <Link
                                                    to={Routes.PRIVACY}
                                                    className="btn submit_btn userInfo_btn genric-btn circle"
                                                >
                                                    <FormattedMessage
                                                        id="userinfo.privacy.button"
                                                        defaultMessage="Privacy"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <Link
                                                    to={Routes.FAQ}
                                                    className="btn submit_btn userInfo_btn genric-btn circle"
                                                >
                                                    <FormattedMessage
                                                        id="userinfo.faq.button"
                                                        defaultMessage="Faq"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <a
                                                    href={emptyHrefLink}
                                                    className="btn submit_btn userInfo_btn genric-btn circle"
                                                    onClick={() => {
                                                        this.setState({
                                                            confirmModalVisible: true,
                                                            confirmModalMessage: this.props.intl.formatMessage({id: 'userInfo.delete.account.question'}),
                                                            deleteAccount: true
                                                        });
                                                    }
                                                    }
                                                >
                                                    <FormattedMessage
                                                        id="userinfo.delete.account.button"
                                                        defaultMessage="Delete account"
                                                    />
                                                </a>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <a
                                                    href={emptyHrefLink}
                                                    className="btn submit_btn userInfo_btn genric-btn circle"
                                                    onClick={this.handleLogOut}
                                                >
                                                    <FormattedMessage
                                                        id="userinfo.logout.button"
                                                        defaultMessage="Logout"
                                                    />
                                                </a>
                                            </div>
                                        </aside>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        userInfo: state.user.userInfo
    };
};


const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(doLogoutAction()),
        updateUserPhoto: (photoUrl) => dispatch(updateUserPhoto(photoUrl))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserInfo));
