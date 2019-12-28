import * as React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase/app';
import {auth} from '../../index';
import FirebaseUIAuth from 'react-firebaseui-localized';
import {setLocalStorage} from '../../helper/StorageHelper';
import {ProviderType, StorageKey} from '../../helper/Constants';

export interface LoginDto {
    uid: string;
    photoURL: string | null;
    displayName: string;
    email: string;
    providerType: ProviderType;
    locale: string;
    creationTime: string;
}

export interface LoginRequestDto {
    uid: string;
    photoURL: string;
    displayName: string;
    email: string;
}

export const LoginMapper = {
    uid: 'uid',
    photoURL: 'photoURL',
    displayName: 'displayName',
    email: 'email',
};

type ILoginProps = {
    currentLocale: string;
};

class LoginComponent extends React.Component<ILoginProps> {

    static onSignInSuccess(response) {
        let objectMapper = require('object-mapper');
        let parsedUser = objectMapper(
            response.user as LoginRequestDto,
            LoginMapper
        ) as LoginDto;
        let providerId = response.user.providerData[0].providerId;
        parsedUser.creationTime = response.user.metadata.creationTime;
        if (providerId.startsWith('google')) {
            parsedUser.providerType = ProviderType.GOOGLE;
        } else if (providerId.startsWith('facebook')) {
            parsedUser.providerType = ProviderType.FACEBOOK;
        } else {
            parsedUser.providerType = ProviderType.NORMAL;
        }
        parsedUser.locale = '';
        setLocalStorage(StorageKey.USER, JSON.stringify(parsedUser));
        return true; // redirects to signInSuccessUrl
    }

    uiConfig = {
        signInFlow: 'popup',
        tosUrl: '/tos',
        signInSuccessUrl: '/categories',
        privacyPolicyUrl: '/privacy',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: LoginComponent.onSignInSuccess,
        },
    };

    public render() {
        return (
            <React.Fragment>
                <section className="login_box_area pb-4 pt-2">
                    <div className="container">
                        <div className="d-flex flex-column align-items-center">
                            <div className="d-lg-flex">
                                <div className="d-flex justify-content-center">
                                    <img
                                        src="/img/charity_discount.png"
                                        alt="Charity Discount Logo"
                                        height="200px"
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center flex-column mt-4 mt-md-0 justify-content-center">
                                <FirebaseUIAuth
                                    lang={this.props.currentLocale}
                                    config={this.uiConfig}
                                    auth={auth}
                                    firebase={firebase}
                                    className="mx-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        currentLocale: state.locale.langResources.language,
    };
};

export default connect(mapStateToProps)(LoginComponent);
