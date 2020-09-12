import React from "react";
import { Redirect } from "react-router";
import { getLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

interface RedirectComponentProps {

}

interface RedirectComponentState {
    redirectKey: string
}

class RedirectComponent extends React.Component<RedirectComponentProps, RedirectComponentState> {

    constructor(props: Readonly<RedirectComponentProps>) {
        super(props);
        this.state = {
            redirectKey: ''
        }

    }

    componentDidMount() {
        let redirectKey = getLocalStorage(StorageKey.REDIRECT_KEY);
        if (redirectKey) {
            this.setState({
                redirectKey: redirectKey
            })
        }
    }

    public render() {
        if (this.state.redirectKey) {
            return <Redirect to={this.state.redirectKey}/>
        }
        return (
            <React.Fragment>

            </React.Fragment>
        );
    }
}

export default RedirectComponent;