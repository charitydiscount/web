import * as React from 'react';
import {connect} from 'react-redux';
import ClientsLogo from '../clients/ClientsLogo';
import {auth} from 'firebase/app';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import {fetchCategories} from "../../rest/CategoriesService";
import {fetchShops} from "../../rest/ShopsService";
import {push} from "connected-react-router";
import {Routes} from "../helper/Routes";
import {store} from "../../index";
import {UserActions} from "./UserActions";
import {setLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";

class LoginComponent extends React.Component {

    static onSignInSuccess(response) {
        //refresh user uid
        setLocalStorage(StorageKey.USER, JSON.stringify(response));
        //gather data
        fetchCategories();
        fetchShops();
        store.dispatch(UserActions.setLoggedUserAction(response));
        store.dispatch(push(Routes.CATEGORIES));
    };

    uiConfig = {
        signInFlow: 'popup',
        tosUrl: '/tos',
        privacyPolicyUrl: '/privacy',
        signInOptions: [
            auth.EmailAuthProvider.PROVIDER_ID,
            auth.GoogleAuthProvider.PROVIDER_ID,
            auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: LoginComponent.onSignInSuccess
        }
    };

    componentDidMount() {
        let uiInstance;
        if (firebaseui.auth.AuthUI.getInstance()) {
            uiInstance = firebaseui.auth.AuthUI.getInstance();
        } else {
            uiInstance = new firebaseui.auth.AuthUI(auth());
        }
        uiInstance.start('#firebaseui', this.uiConfig);
    }

    public render() {
        return (
            <React.Fragment>
                <section className="login_box_area p_120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="login_box_img">
                                    <img className="img-fluid" src="img/login.jpg" alt=""/>
                                </div>
                            </div>
                            <div className="col-lg-6 d-flex">
                                <div id="firebaseui" className="m-auto"/>
                            </div>
                        </div>
                    </div>
                </section>

                <ClientsLogo/>
            </React.Fragment>
        );
    }
}

export default connect()(LoginComponent);
