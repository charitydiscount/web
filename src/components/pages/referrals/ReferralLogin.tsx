import React, { useEffect } from "react";
import { Redirect } from "react-router";
import { Routes } from "../../helper/Routes";
import { setLocalStorage } from "../../../helper/StorageHelper";
import { StorageKey } from "../../../helper/Constants";

const ReferralLogin = (props: { match: any }) => {

    useEffect(() => {
        if (props.match.params.key) {
            setLocalStorage(StorageKey.REFERRAL_KEY, props.match.params.key);
        }
    }, [props])

    return (
        <Redirect to={Routes.LOGIN}/>
    )
}

export default ReferralLogin;