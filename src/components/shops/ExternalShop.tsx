import React from "react";
import { Redirect } from "react-router";
import { Routes } from "../helper/Routes";
import { setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

interface ExternalShopProps {
    match: any;
}

class ExternalShop extends React.Component<ExternalShopProps> {

    componentDidMount() {
        if (this.props.match.params.shopName) {
            setLocalStorage(StorageKey.EXTERNAL_SHOP, this.props.match.params.shopName);
        }
    }

    public render() {
        return (
            <Redirect to={Routes.LOGIN}/>
        )
    }
}

export default ExternalShop;