import { auth, storage, store } from '../../index';
import { NavigationsAction } from '../../redux/actions/NavigationsAction';
import { Stages } from '../helper/Stages';
import * as React from 'react';
import {
    emptyHrefLink,
    profilePictureDefaultName,
    StorageRef,
} from '../../helper/Constants';
import { doLogoutAction } from './UserActions';
import { connect } from 'react-redux';
import FileUploader from 'react-firebase-file-uploader';
import Modal from 'react-awesome-modal';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { smallerSpinnerCss, spinnerCss, } from '../../helper/AppHelper';
import { addContactMessageToDb } from '../../rest/ContactService';
import FadeLoader from 'react-spinners/FadeLoader';
import { loadUserPhoto, UserPhotoState } from "./UserPhotoHelper";

interface IUserInfoProps {
    intl: IntlShape;
    logout: () => void;
}

interface IUserInfoState extends UserPhotoState {
    modalVisible: boolean;
    modalMessage: string;
    isLoading: boolean;
}

class UserInfo extends React.Component<IUserInfoProps, IUserInfoState> {
    constructor(props: IUserInfoProps) {
        super(props);
        this.state = {
            photoURL: '',
            displayName: '',
            email: '',
            userId: '',
            modalVisible: false,
            normalUser: false,
            modalMessage: '',
            isLoading: false,
            isLoadingPhoto: false,
        };
        this.handleLogOut = this.handleLogOut.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleUploadError = this.handleUploadError.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleEmailResetSent = this.handleEmailResetSent.bind(this);
        this.sendPasswordResetEmail = this.sendPasswordResetEmail.bind(this);
        this.handleRequestDeleteAccount = this.handleRequestDeleteAccount.bind(
            this
        );
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    async componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
        store.dispatch(NavigationsAction.setStageAction(Stages.USER));
        await loadUserPhoto(this);
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
    }

    async handleRequestDeleteAccount() {
        let question = window.confirm(
            this.props.intl.formatMessage({
                id: 'userInfo.delete.account.question',
            })
        );
        if (question === true) {
            if (auth.currentUser) {
                this.setState({
                    isLoading: true,
                });
                await addContactMessageToDb(
                    auth.currentUser.displayName,
                    auth.currentUser.email,
                    auth.currentUser.uid,
                    'Request to delete account with id:' +
                    auth.currentUser.uid,
                    'Delete account with id:' +
                    auth.currentUser.uid
                )
                    .then(() => {
                        this.setState({
                            modalVisible: true,
                            isLoading: false,
                            modalMessage: this.props.intl.formatMessage({
                                id: 'userInfo.delete.account.ok',
                            }),
                        });
                    })
                    .catch(() => {
                        this.setState({
                            modalVisible: true,
                            isLoading: false,
                            modalMessage: this.props.intl.formatMessage({
                                id: 'userInfo.delete.account.not.ok',
                            }),
                        });
                    });
            }
        }
    }

    public handleLogOut(event: any) {
        event.preventDefault();
        this.props.logout();
    }

    handleEmailResetSent(success) {
        this.setState({
            modalVisible: true,
            isLoading: false,
            modalMessage: success
                ? this.props.intl.formatMessage({
                    id: 'userInfo.email.reset.sent',
                })
                : this.props.intl.formatMessage({
                    id: 'userInfo.email.reset.error',
                }),
        });
    }

    sendPasswordResetEmail() {
        this.setState({
            isLoading: true,
        });
        auth.sendPasswordResetEmail(this.state.email)
            .then(
                succes => this.handleEmailResetSent(true) // Password reset email sent.
            )
            .catch(error => this.handleEmailResetSent(false));
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            modalMessage: '',
        });
        window.location.reload();
    }

    handleUploadSuccess() {
        this.setState({
            modalVisible: true,
            isLoadingPhoto: false,
            modalMessage: this.props.intl.formatMessage({
                id: 'userInfo.profile.picture.uploaded',
            }),
        });
    }

    handleUploadError(event) {
        this.setState({
            modalVisible: true,
            isLoadingPhoto: false,
            modalMessage: this.props.intl.formatMessage({
                id: 'userInfo.profile.picture.error',
            }),
        });
    }

    public render() {
        return (
            <React.Fragment>
                <FadeLoader
                    loading={this.state.isLoading}
                    color={'#1641ff'}
                    css={spinnerCss}
                />
                <Modal
                    visible={this.state.modalVisible}
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <h3 style={{padding: 15}}>{this.state.modalMessage}</h3>
                </Modal>
                {!this.state.isLoading && (
                    <div className="product_image_area">
                        <div className="container p_90">
                            <div className="row s_product_inner">
                                <div className="col-lg-4"/>
                                <div className="col-lg-4">
                                    <div className="s_product_img">
                                        <div className="blog_right_sidebar">
                                            <aside className="single_sidebar_widget author_widget">
                                                <FadeLoader
                                                    loading={
                                                        this.state
                                                            .isLoadingPhoto
                                                    }
                                                    color={'#1641ff'}
                                                    css={smallerSpinnerCss}
                                                />
                                                {!this.state.isLoadingPhoto && (
                                                    <img
                                                        className="author_img rounded-circle"
                                                        src={
                                                            this.state.photoURL
                                                        }
                                                        alt="Missing"
                                                        width={200}
                                                        height={200}
                                                    />
                                                )}
                                                <h4>
                                                    {this.state.displayName}
                                                </h4>
                                                <p>{this.state.email}</p>
                                                <div className="br"/>
                                            </aside>
                                            <aside className="single_sidebar_widget popular_post_widget">
                                                {this.state.normalUser && (
                                                    <div>
                                                        <div className="col-md-12 text-center p_05">
                                                            <a
                                                                href={
                                                                    emptyHrefLink
                                                                }
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
                                                                            this
                                                                                .state
                                                                                .userId
                                                                        )}
                                                                        onUploadError={
                                                                            this
                                                                                .handleUploadError
                                                                        }
                                                                        onUploadSuccess={
                                                                            this
                                                                                .handleUploadSuccess
                                                                        }
                                                                        onUploadStart={() =>
                                                                            this.setState(
                                                                                {
                                                                                    isLoadingPhoto: true,
                                                                                }
                                                                            )
                                                                        }
                                                                    />
                                                                </label>
                                                            </a>
                                                        </div>
                                                        <div className="col-md-12 text-center p_05">
                                                            <a
                                                                href={
                                                                    emptyHrefLink
                                                                }
                                                                onClick={
                                                                    this
                                                                        .sendPasswordResetEmail
                                                                }
                                                                className="btn submit_btn userInfo_btn genric-btn circle"
                                                            >
                                                                <FormattedMessage
                                                                    id="userinfo.change.password.button"
                                                                    defaultMessage="Change password"
                                                                />
                                                            </a>
                                                        </div>
                                                        <div className="br"/>
                                                    </div>
                                                )}
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={'/contact'}
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                    >
                                                        <FormattedMessage
                                                            id="userinfo.contact.us.button"
                                                            defaultMessage="Contact us"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={'/tos'}
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                    >
                                                        <FormattedMessage
                                                            id="userinfo.terms.button"
                                                            defaultMessage="Terms of agreement"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={'/privacy'}
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                    >
                                                        <FormattedMessage
                                                            id="userinfo.privacy.button"
                                                            defaultMessage="Privacy"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={'/faq'}
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                    >
                                                        <FormattedMessage
                                                            id="userinfo.faq.button"
                                                            defaultMessage="Faq"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a
                                                        href={emptyHrefLink}
                                                        className="btn submit_btn userInfo_btn genric-btn circle"
                                                        onClick={
                                                            this
                                                                .handleRequestDeleteAccount
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
                                                        onClick={
                                                            this.handleLogOut
                                                        }
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
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(doLogoutAction()),
    };
};

export default connect(null, mapDispatchToProps)(injectIntl(UserInfo));
