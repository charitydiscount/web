import * as React from 'react';
import {auth, store} from '../../index';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {Routes} from '../helper/Routes';
import LoginComponent from "../login/LoginComponent";
import {getUrlParameter, spinnerCss} from "../../helper/AppHelper";
import {UserActions} from "../login/UserActions";
import {parseAndSaveUser} from "../../helper/AuthHelper";
import FadeLoader from 'react-spinners/FadeLoader';

interface ExternalAccessState {
    page: string,
    caseId: string,
    isLoading: boolean
}

interface ExternalAccessProps {
    isUserLogged: boolean;
}

class ExternalAccess extends React.Component<ExternalAccessProps, ExternalAccessState> {

    constructor(props: ExternalAccessProps) {
        super(props);
        this.state = {
            page: '',
            caseId: '',
            isLoading: true
        };
    }

    async componentDidMount() {
        let pageFromUrl = getUrlParameter('page');
        let token = getUrlParameter('token');
        let caseIdFromUrl = getUrlParameter('case');
        if (token) {
            try {
                let response = await this.verifyUserLoggedInFirebase(token);
                if (response) {
                    this.setState({
                        page: pageFromUrl,
                        caseId: caseIdFromUrl
                    })
                }
            } catch (e) {
                //nothing will happen, user will not login
            }
        }
    }

    public verifyUserLoggedInFirebase(token) {
        return new Promise((resolve, reject) => {
            return auth.signInWithCustomToken(token)
                .then((response) => {
                        if (response.user) {
                            let parsedUser = parseAndSaveUser(response.user);
                            store.dispatch(UserActions.setLoggedUserAction(parsedUser));
                            this.setState({
                                isLoading: false
                            });
                            resolve(true);
                        }
                        this.setState({
                            isLoading: false
                        });
                    }
                ).catch((error) => {
                    console.log(error);
                    this.setState({
                        isLoading: false
                    });
                    //token is not valid
                    reject();
                });
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
                {!this.state.isLoading &&
                <React.Fragment>
                    {this.props.isUserLogged &&
                    this.state.page &&
                    this.state.caseId &&
                    this.state.page === "wallet" ? (
                            <Redirect to={Routes.WALLET + "/donate/" + this.state.caseId}/>
                        ) :
                        <LoginComponent/>
                    }
                </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        isUserLogged: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(ExternalAccess);
