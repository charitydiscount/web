import React from "react";
import { Routes } from "../helper/Routes";
import { setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";
import { Redirect } from "react-router";

class UnsubscribeMailRedirect extends React.Component {

    componentDidMount() {
        setLocalStorage(StorageKey.REDIRECT_KEY, Routes.USER);
    }

    public render() {
        return (
            <Redirect to={Routes.LOGIN}/>
        )
    }
}

export default UnsubscribeMailRedirect;