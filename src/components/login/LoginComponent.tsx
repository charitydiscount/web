import * as React from 'react';
import { connect } from 'react-redux';
import ClientsLogo from '../clients/ClientsLogo';
import { auth } from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { setLocalStorage } from '../../helper/StorageHelper';
import { ProviderType, StorageKey } from '../../helper/Constants';

export interface LoginDto {
  uid: string;
  photoURL: string | null;
  displayName: string;
  email: string;
  providerType: ProviderType;
  creationTime: string;
}

export interface LoginRequestDto {
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
}

export var LoginMapper = {
  uid: 'uid',
  photoURL: 'photoURL',
  displayName: 'displayName',
  email: 'email',
};

class LoginComponent extends React.Component {
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
        <section className="login_box_area pb-4 pt-2">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 d-flex align-items-center">
                <a className="mx-auto text-center" href="/landing-ro.html">
                  Not sure what Charity Discount is?
                </a>
              </div>
              <div className="col-lg-4 d-flex align-items-center">
                <div className="login_box_img mx-auto">
                  <img
                    src="img/charity_discount.png"
                    alt="Charity Discount Logo"
                    height="300px"
                  />
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-center flex-column">
                <div>
                  Ready to join?<span>&#128079;</span>
                </div>
                <div id="firebaseui" className="mx-auto" />
              </div>
            </div>
          </div>
        </section>

        <ClientsLogo />
      </React.Fragment>
    );
  }
}

export default connect()(LoginComponent);
