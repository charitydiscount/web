import * as React from 'react';
import {auth, store} from '../../index';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {Routes} from '../helper/Routes';
import LoginComponent from "../login/LoginComponent";
import {getUrlParameter} from "../../helper/AppHelper";
import {UserActions} from "../login/UserActions";
import {parseAndSaveUser} from "../../helper/AuthHelper";

interface ExternalAccessState {
    page: string
    caseId: string
}

interface ExternalAccessProps {
    isUserLogged: boolean;
}

class ExternalAccess extends React.Component<ExternalAccessProps, ExternalAccessState> {

    constructor(props: ExternalAccessProps) {
        super(props);
        this.state = {
            page: '',
            caseId: ''
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
                console.log(e);
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
                            resolve(true);
                        }
                    }
                ).catch((error) => {
                    console.log(error);
                    reject();
                });
        });
    }

    public render() {
        return this.props.isUserLogged &&
        this.state.page &&
        this.state.caseId &&
        this.state.page === "wallet" ? (
            <Redirect to={Routes.WALLET + "/donate/" + this.state.caseId}/>
        ) : (
            <LoginComponent/>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        isUserLogged: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(ExternalAccess);
