import React from "react";
import { Redirect } from "react-router";
import { Routes } from "../helper/Routes";
import { setLocalStorage } from "../../helper/StorageHelper";
import { StorageKey } from "../../helper/Constants";

interface ExternalShopProps {
    match: any;
}

/**
 * Component used to save the shop when you come from URL
 */
class ExternalShop extends React.Component<ExternalShopProps> {

    componentDidMount() {
        if (this.props.match.params.shopName) {
            setLocalStorage(StorageKey.SELECTED_SHOP, this.props.match.params.shopName);
        }
    }

    public render() {
        return (
            <Redirect to={Routes.LOGIN}/>
        )
    }
}

export default ExternalShop;