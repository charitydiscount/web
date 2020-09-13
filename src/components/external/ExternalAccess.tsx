import * as React from 'react';
import {auth, store} from '../../index';
import {Redirect} from 'react-router';
import LoginComponent from "../login/LoginComponent";
import {getUrlParameter, spinnerCss} from "../../helper/AppHelper";
import {AuthActions} from "../login/UserActions";
import FadeLoader from 'react-spinners/FadeLoader';
import { parseAndSaveUser } from "../login/AuthHelper";

interface ExternalAccessState {
    page: string,
    caseId: string,
    isLoading: boolean
}

interface ExternalAccessProps {
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
                let response = await this.authenticateExternally(token);
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

    public authenticateExternally(token) {
        return new Promise((resolve, reject) => {
            return auth.signInWithCustomToken(token)
                .then((response) => {
                        if (response.user) {
                            let parsedUser = parseAndSaveUser(response.user);
                            store.dispatch(AuthActions.setLoggedUserAction(parsedUser));
                            this.setState({
                                isLoading: false
                            });
                            resolve(true);
                        }
                        this.setState({
                            isLoading: false
                        });
                    }
                ).catch(() => {
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
                    {this.state.page && this.state.caseId &&
                        <Redirect to={"/" + this.state.page + "/donate/" + this.state.caseId}/>
                    }
                    <LoginComponent/>
                </React.Fragment>
                }
            </React.Fragment>
        );
    }
}


export default ExternalAccess;
