import React from "react";
import { Redirect } from "react-router";
import { Routes } from "../helper/Routes";
import { setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

interface ReferralLoginProps {
    match: any;
}

class ReferralLogin extends React.Component<ReferralLoginProps> {

    componentDidMount() {
        if (this.props.match.params.key) {
            setLocalStorage(StorageKey.REFERRAL_KEY, this.props.match.params.key);
        }
    }

    public render() {
        return (
            <Redirect to={Routes.LOGIN}/>
        )
    }
}

export default ReferralLogin;