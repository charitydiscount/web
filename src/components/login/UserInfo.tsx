import {store} from '../../index';
import {NavigationsAction} from '../../redux/actions/NavigationsAction';
import {Stages} from '../helper/Stages';
import * as React from 'react';
import {getLocalStorage} from "../../helper/StorageHelper";
import {emptyHrefLink, ProviderType, StorageKey} from "../../helper/Constants";
import {LoginDto} from "./LoginComponent";
import {doLogoutAction} from "./UserActions";
import {connect} from "react-redux";

interface IUserInfoProps {
    logout: () => void
}

interface IUserInfoState {
    photoURL: string;
    displayName: string;
    email: string;
    providerType: ProviderType;
}

class UserInfo extends React.Component<IUserInfoProps, IUserInfoState> {

    constructor(props: IUserInfoProps) {
        super(props);
        this.state = {
            photoURL: "",
            displayName: "",
            email: "",
            providerType: ProviderType.NORMAL
        };
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.USER));
        var user = getLocalStorage(StorageKey.USER);
        if (user) {
            var userParsed = JSON.parse(user) as LoginDto;
            this.setState({
                photoURL: userParsed.photoURL ? userParsed.photoURL : '',
                displayName: userParsed.displayName,
                email: userParsed.email,
                providerType: userParsed.providerType
            })
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
    }

    public handleLogOut(event: any) {
        event.preventDefault();
        this.props.logout();
    }

    public render() {
        let photoUrl = this.state.photoURL;
        if (photoUrl.includes("facebook")) {
            photoUrl += '?height=200';
        }

        return (

            <div className="product_image_area">
                <div className="container p_90">
                    <div className="row s_product_inner">
                        <div className="col-lg-4"/>
                        <div className="col-lg-4">
                            <div className="s_product_img">
                                <div className="blog_right_sidebar">
                                    <aside className="single_sidebar_widget author_widget">
                                        <img className="author_img rounded-circle" src={photoUrl}
                                             alt="Missing" width={200} height={200}/>
                                        <h4>{this.state.displayName}</h4>
                                        <p>{this.state.email}</p>
                                        <div className="br"></div>
                                    </aside>
                                    <aside className="single_sidebar_widget popular_post_widget">
                                        {this.state.providerType === ProviderType.NORMAL
                                        &&
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"#"} className="btn submit_btn userInfo_btn">Change password</a>
                                        </div>
                                        }
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"/contact"} className="btn submit_btn userInfo_btn">Contact us</a>
                                        </div>
                                        <div className="br"></div>
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"/tos"} className="btn submit_btn userInfo_btn">Terms of
                                                agreement</a>
                                        </div>
                                        <div className="col-md-12 text-center p_05">
                                            <a href={"/privacy"} className="btn submit_btn userInfo_btn">Privacy</a>
                                        </div>
                                        <div className="col-md-12 text-center p_05">
                                            <a href={emptyHrefLink} className="btn submit_btn userInfo_btn"
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
