import * as React from 'react';
import {connect} from 'react-redux';
import ClientsLogo from '../clients/ClientsLogo';
import {auth} from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import {setLocalStorage} from '../../helper/StorageHelper';
import {StorageKey} from '../../helper/Constants';

export interface LoginDto {
    uid: string;
    photoURL: string;
    displayName: string;
    email: string;
}

export var LoginMapper = {
    uid: "uid",
    photoURL: "photoURL",
    displayName: "displayName",
    email: "email",
};


class LoginComponent extends React.Component {

    static onSignInSuccess(response) {
        //refresh user
        var objectMapper = require('object-mapper');
        let parsedUser = objectMapper(response.user as LoginDto, LoginMapper);
        setLocalStorage(StorageKey.USER, JSON.stringify(parsedUser));
        return true; // redirects to signInSuccessUrl
    }

    uiConfig = {
        signInFlow: 'popup',
        tosUrl: '/tos',
        signInSuccessUrl: '/categories',
        privacyPolicyUrl: '/privacy',
        signInOptions: [
            auth.EmailAuthProvider.PROVIDER_ID,
            auth.GoogleAuthProvider.PROVIDER_ID,
            auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: LoginComponent.onSignInSuccess,
        },
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
                                    <img
                                        className="img-fluid"
                                        src="img/charity_discount.png"
                                        alt="Charit Discount"
                                    />
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
