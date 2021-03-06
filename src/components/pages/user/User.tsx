import { auth, storage, store } from '../../../index';
import { NavigationsAction } from '../../../redux/actions/NavigationsAction';
import { Stages } from '../../helper/Stages';
import * as React from 'react';
import {
    emptyHrefLink, profilePictureDefaultName, StorageRef,
} from '../../../helper/Constants';
import { doLogoutAction, updateUserNameInState, updateUserPhotoInState } from '../../../redux/actions/UserActions';
import { connect } from 'react-redux';
import FileUploader from 'react-firebase-file-uploader';
import { FormattedMessage } from 'react-intl';
import { addDefaultImgSrc, getImagePath, keyDownEscapeEvent, spinnerCss } from '../../../helper/AppHelper';
import FadeLoader from 'react-spinners/FadeLoader';
import { Routes } from '../../helper/Routes';
import { Link } from 'react-router-dom';
import InfoModal from '../../modals/InfoModal';
import ConfirmModal from '../../modals/ConfimModal';
import {
    getUserDbInfo,
    updateDisableMailNotification,
    updateUserName,
    updateUserPhotoUrl,
    updateUserPrivateName,
    updateUserPrivatePhoto,
    UserDto,
} from '../../../rest/UserService';
import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { getUserId, UserInfoDto } from '../login/AuthHelper';
import OtpModal from "../../modals/OtpModal";
import { createOtpRequest, validateOtpCode } from "../../../rest/WalletService";
import { fetchProfilePhoto } from "../../../rest/StorageService";
import UserUpdateModal from "../../modals/UserUpdateModal";
import { intl } from "../../../helper/IntlGlobal";

interface IUserInfoProps {
    logout: () => void;
    updateUserPhotoInState: (photoUrl: string) => void,
    updateUserNameInState: (name: string) => void,
    userInfo: UserInfoDto
}

interface IUserInfoState {
    infoModalVisible: boolean;
    infoModalMessage: string;
    confirmModalVisible: boolean;
    confirmModalMessage: string;
    otpModalVisible: boolean,
    userNameModalVisible: boolean,
    deleteAccount: boolean;
    accountDeleted: boolean;
    isLoading: boolean;
    disableMailNotification: Boolean;
    privateName: boolean;
    privatePhoto: boolean
}

class User extends React.Component<IUserInfoProps, IUserInfoState> {

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
            userNameModalVisible: false,
            privatePhoto: false
        };
    }

    escFunction = () => {
        this.closeInfoModal();
        this.closeConfirmModal();
        this.closeOtpModal();
    };

    async componentDidMount() {
        keyDownEscapeEvent(() => this.escFunction());
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
                    infoModalMessage: intl.formatMessage({
                        id: checked
                            ? 'user.private.name.success.true'
                            : 'user.private.name.success.false',
                    }),
                });
            })
            .catch((error) => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: intl.formatMessage({id: 'user.update.general.error'})
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
                    infoModalMessage: intl.formatMessage({
                        id: checked
                            ? 'user.private.photo.success.true'
                            : 'user.private.photo.success.false',
                    }),
                });
            })
            .catch((error) => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: intl.formatMessage({id: 'user.update.general.error'})
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
                    infoModalMessage: intl.formatMessage({
                        id: !checked
                            ? 'user.disable.mail.notification.success.true'
                            : 'user.disable.mail.notification.success.false',
                    }),
                });
            })
            .catch((error) => {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: intl.formatMessage({id: 'user.update.general.error'})
                });
            });
    };

    updateUserInfoName = async (name) => {
        await updateUserName(name)
            .then(() => {
                this.props.updateUserNameInState(name);
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: intl.formatMessage({
                        id: 'user.update.name.success'
                    }),
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: intl.formatMessage({id: 'user.update.general.error'})
                });
            });
    };

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
                infoModalMessage: intl.formatMessage({id: 'otp.code.empty'})
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
                            infoModalMessage: intl.formatMessage({id: 'userInfo.delete.account.not.ok.reason'}) + e.message
                        });
                    }
                }
            } else {
                this.setState({
                    infoModalVisible: true,
                    infoModalMessage: intl.formatMessage({id: 'otp.code.wrong'})
                });
            }
        } catch (error) {
            this.setState({
                infoModalVisible: true,
                infoModalMessage: intl.formatMessage({id: 'otp.code.wrong'})
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
                ? intl.formatMessage({
                    id: 'userInfo.email.reset.sent',
                })
                : intl.formatMessage({
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
            userNameModalVisible: false,
            infoModalVisible: false
        });
    };

    closeOtpModal = () => {
        this.setState({
            otpModalVisible: false
        });
    };

    closeUserUpdateModal = () => {
        this.setState({
            userNameModalVisible: false
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
            infoModalMessage: intl.formatMessage({
                id: 'userInfo.profile.picture.uploaded',
            }),
        });
        this.props.updateUserPhotoInState(response as string);
    };

    handleUploadError = () => {
        this.setState({
            infoModalVisible: true,
            infoModalMessage: intl.formatMessage({
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
                <UserUpdateModal visible={this.state.userNameModalVisible}
                                 onClose={this.closeUserUpdateModal}
                                 onValidate={this.updateUserInfoName}
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
                                                    label={intl.formatMessage(
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
                                                    label={intl.formatMessage(
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
                                                        label={intl.formatMessage(
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
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={emptyHrefLink}
                                                        onClick={
                                                            () => {
                                                                this.setState({
                                                                    userNameModalVisible: true
                                                                });
                                                            }
                                                        }
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                    >
                                                        <FormattedMessage
                                                            id="user.update.name.button"
                                                            defaultMessage="Schimba numele"
                                                        />
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
                                                                        confirmModalMessage: intl.formatMessage({id: 'userInfo.email.reset.confirm'})
                                                                    });
                                                                }
                                                            }
                                                            className="btn submit_btn userInfo_btn genric-btn circle"
                                                        >
                                                            <FormattedMessage
                                                                id="userinfo.change.password.button"
                                                                defaultMessage="Schimba parola"
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
                                                            confirmModalMessage: intl.formatMessage({id: 'userInfo.delete.account.question'}),
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
        updateUserPhotoInState: (photoUrl) => dispatch(updateUserPhotoInState(photoUrl)),
        updateUserNameInState: (name) => dispatch(updateUserNameInState(name))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
