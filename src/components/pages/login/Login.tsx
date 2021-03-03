import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import { auth, store } from '../../../index';
import FirebaseUIAuth from 'react-firebaseui-localized';
import { parseAndSaveUser } from "./AuthHelper";
import { useEffect } from "react";
import { NavigationsAction } from "../../../redux/actions/NavigationsAction";
import { Stages } from "../../helper/Stages";
import { Redirect } from "react-router";
import { Routes } from "../../helper/Routes";

type ILoginProps = {
    currentLocale: string,
    isLoggedIn: boolean
};

const Login = (props: ILoginProps) => {

    useEffect(() => {
        store.dispatch(NavigationsAction.setStageAction(Stages.LOGIN));
    }, [])

    const onSignInSuccess = (response) => {
        parseAndSaveUser(response.user);
        if (response.user.providerData[0] &&
            response.user.providerData[0].providerId === "password" &&
            !response.user.emailVerified) {
            //verify used created with mail and password
            response.user.sendEmailVerification();
        }
        return true; // redirects to signInSuccessUrl
    }

    const uiConfig = {
        signInFlow: 'popup',
        tosUrl: '/tos',
        signInSuccessUrl: '/shops',
        privacyPolicyUrl: '/privacy',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: onSignInSuccess,
        },
    };

    return props.isLoggedIn ? (
        <Redirect to={Routes.SHOPS}/>
    ) : (
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
                                lang={props.currentLocale}
                                config={uiConfig}
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

const mapStateToProps = (state: any) => {
    return {
        currentLocale: state.locale.langResources.language,
        isLoggedIn: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(Login);
