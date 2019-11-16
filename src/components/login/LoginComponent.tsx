import * as React from 'react';
import { connect } from 'react-redux';
import ClientsLogo from '../clients/ClientsLogo';
import firebase from 'firebase/app';
import { auth } from '../../index';
import FirebaseUIAuth from 'react-firebaseui-localized';
import { setLocalStorage } from '../../helper/StorageHelper';
import { ProviderType, StorageKey } from '../../helper/Constants';
import { FormattedMessage } from 'react-intl';

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
        var objectMapper = require('object-mapper');
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
                <section
                    style={{ height: '400px' }}
                    className="login_box_area pb-4 pt-2"
                >
                    <div className="container h-100">
                        <div className="row justify-content-between d-flex h-100">
                            <div className="col-lg-4 d-flex align-items-center">
                                <a
                                    className="mx-auto text-center"
                                    href="/landing-ro.html"
                                >
                                    <FormattedMessage
                                        id="login.question.label"
                                        defaultMessage="Not sure what Charity Discount is?"
                                    />
                                </a>
                            </div>
                            <div className="col-lg-4 align-items-center d-none d-md-flex">
                                <div className="login_box_img mx-auto">
                                    <img
                                        src="img/charity_discount.png"
                                        alt="Charity Discount Logo"
                                        height="200px"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 d-flex align-items-center flex-column mt-4 mt-md-0 justify-content-center">
                                <div>
                                    <FormattedMessage
                                        id="login.question.ready.label"
                                        defaultMessage="Ready to join?"
                                    />
                                    <span>&#128079;</span>
                                </div>
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

                <ClientsLogo />
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
