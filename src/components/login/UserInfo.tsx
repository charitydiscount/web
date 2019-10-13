import {auth, fbStorage, store} from '../../index';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import {Stages} from '../helper/Stages';
import * as React from 'react';
import {getLocalStorage} from "../../helper/StorageHelper";
import {emptyHrefLink, ProviderType, StorageKey} from "../../helper/Constants";
import {LoginDto} from "./LoginComponent";
import {doLogoutAction} from "./UserActions";
import {connect} from "react-redux";
import FileUploader from 'react-firebase-file-uploader';
import Modal from 'react-awesome-modal';

interface IUserInfoProps {
    logout: () => void
}

interface IUserInfoState {
    photoURL: string;
    displayName: string;
    email: string;
    providerType: ProviderType,
    userId: string,
    modalVisible: boolean,
    modalMessage: string
}

class UserInfo extends React.Component<IUserInfoProps, IUserInfoState> {

    constructor(props: IUserInfoProps) {
        super(props);
        this.state = {
            photoURL: "",
            displayName: "",
            email: "",
            userId: "",
            providerType: ProviderType.NORMAL,
            modalVisible: false,
            modalMessage: ""
        };
        this.handleLogOut = this.handleLogOut.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleUploadError = this.handleUploadError.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleEmailResetSent = this.handleEmailResetSent.bind(this);
        this.sendPasswordResetEmail = this.sendPasswordResetEmail.bind(this);
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.USER));
        const user = getLocalStorage(StorageKey.USER);
        if (user) {
            const userParsed = JSON.parse(user) as LoginDto;


            this.setState({
                photoURL: userParsed.photoURL ? userParsed.photoURL : '',
                displayName: userParsed.displayName,
                email: userParsed.email,
                providerType: userParsed.providerType,
                userId: userParsed.uid
            });

            if (!userParsed.photoURL) {
                fbStorage.ref("profilePhotos/" + userParsed.uid)
                    .child("profilePicture.png")
                    .getDownloadURL()
                    .then(url => this.setState({photoURL: url}))
                    .catch(() => this.setState({photoURL: "/img/no-image.jpg"}));
            } else {
                if (this.state.photoURL.includes("facebook")) {
                    this.setState({
                        photoURL: this.state.photoURL + "?height=200"
                    });
                }
            }
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
    }

    public handleLogOut(event: any) {
        event.preventDefault();
        this.props.logout();
    }

    handleEmailResetSent(success) {
        this.setState({
            modalVisible: true,
            modalMessage: success ? "Email reset password sent" : "Failed to send password reset email"
        });
    }

    sendPasswordResetEmail() {
        auth.sendPasswordResetEmail(
            this.state.email)
            .then((succes) =>
                this.handleEmailResetSent(true)  // Password reset email sent.
            )
            .catch((error) =>
                this.handleEmailResetSent(false)
            );
    }


    closeModal() {
        this.setState({
            modalVisible: false,
            modalMessage: ''
        });
        window.location.reload();
    }


    handleUploadSuccess() {
        this.setState({
            modalVisible: true,
            modalMessage: "Profile photo uploaded successfully"
        });
    };

    handleUploadError(event) {
        this.setState({
            modalVisible: true,
            modalMessage: "Failed to upload. Warning! Photo size must be smaller than 5 MB"
        });
    };

    public render() {
        return (
            <React.Fragment>
                <Modal visible={this.state.modalVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <h3 style={{padding: 15}}>
                        {this.state.modalMessage}
                    </h3>
                </Modal>
                <div className="product_image_area">
                    <div className="container p_90">
                        <div className="row s_product_inner">
                            <div className="col-lg-4"/>
                            <div className="col-lg-4">
                                <div className="s_product_img">
                                    <div className="blog_right_sidebar">
                                        <aside className="single_sidebar_widget author_widget">
                                            <img className="author_img rounded-circle" src={this.state.photoURL}
                                                 alt="Missing" width={200} height={200}/>
                                            <h4>{this.state.displayName}</h4>
                                            <p>{this.state.email}</p>
                                            <div className="br"/>
                                        </aside>
                                        <aside className="single_sidebar_widget popular_post_widget">
                                            {this.state.providerType === ProviderType.NORMAL
                                            &&
                                            <div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a href={emptyHrefLink}
                                                       className="btn submit_btn userInfo_btn genric-btn circle">
                                                        <label style={{
                                                            marginBottom: 0,
                                                            minWidth: '100%',
                                                            borderRadius: 20,
                                                            cursor: 'pointer'
                                                        }}>
                                                            Upload photo
                                                            <FileUploader
                                                                hidden
                                                                accept="image/*"
                                                                filename={"profilePicture.png"}
                                                                storageRef={fbStorage.ref('profilePhotos/' + this.state.userId)}
                                                                onUploadError={this.handleUploadError}
                                                                onUploadSuccess={this.handleUploadSuccess}
                                                            />
                                                        </label>
                                                    </a>
                                                </div>
                                                <div className="col-md-12 text-center p_05">
                                                    <a href={emptyHrefLink}
                                                       onClick={this.sendPasswordResetEmail}
                                                       className="btn submit_btn userInfo_btn genric-btn circle">
                                                        Change password
                                                    </a>
                                                </div>
                                                <div className="br"/>
                                            </div>
                                            }
                                            <div className="col-md-12 text-center p_05">
                                                <a href={"/contact"}
                                                   className="btn submit_btn userInfo_btn genric-btn circle">Contact
                                                    us</a>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <a href={"/tos"}
                                                   className="btn submit_btn userInfo_btn genric-btn circle">Terms
                                                    of
                                                    agreement</a>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <a href={"/privacy"}
                                                   className="btn submit_btn userInfo_btn genric-btn circle">Privacy</a>
                                            </div>
                                            <div className="col-md-12 text-center p_05">
                                                <a href={emptyHrefLink}
                                                   className="btn submit_btn userInfo_btn genric-btn circle"
                                                   onClick={this.handleLogOut}>
                                                    Logout
                                                </a>
                                            </div>
                                        </aside>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            logout: () => dispatch(doLogoutAction())
        };
    };

export default connect(null, mapDispatchToProps)(UserInfo);
