import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Product } from '../../../rest/ProductsService';
import { Routes } from '../../helper/Routes';
import { emptyHrefLink, StorageKey } from '../../../helper/Constants';
import { Link } from 'react-router-dom';
import RedirectModal from '../shops/RedirectModal';
import { getLocalStorage } from '../../../helper/StorageHelper';
import { clickSaveAndRedirect } from "../../../rest/ClickService";
import { addDefaultImgSrc } from "../../../helper/AppHelper";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { ShopDto } from "../../../rest/ShopsService";
import { setCurrentProduct } from "../../../redux/actions/ProductsAction";
import { useState } from "react";
import { intl } from "../../../helper/IntlGlobal";

interface ProductElementProps {
    product: Product;
    productInfo: boolean;
    onCloseModal?: () => void;
    allShops: ShopDto[],
    setCurrentProduct: Function
}

const ProductDetail = (props: ProductElementProps) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    let accessButton;
    let redirectStorageKey = getLocalStorage(StorageKey.REDIRECT_MESSAGE);
    if (redirectStorageKey && redirectStorageKey === 'true') {
        accessButton = (
            <a
                href={emptyHrefLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                    clickSaveAndRedirect(event, props.product.shopId, props.product.url)
                }}
                className="main_btn"
            >
                <FormattedMessage
                    id={'shop.access.button'}
                    defaultMessage="Access"
                />
            </a>
        );
    } else {
        accessButton = (
            <a
                href={emptyHrefLink}
                rel="noopener noreferrer"
                className="main_btn"
                onClick={() => setModalVisible(true)}
            >
                <FormattedMessage
                    id={'shop.access.button'}
                    defaultMessage="Access"
                />
            </a>
        );
    }

    let shopFound = props.allShops.find((shop) =>
        shop.id === Number(props.product.shopId)
    );
    let shopLogo;
    if (shopFound) {
        shopLogo = shopFound.logoPath;
    }

    return (
        <React.Fragment>
            <RedirectModal
                visible={modalVisible}
                programId={props.product.shopId}
                onCloseModal={() => setModalVisible(false)}
                cashbackUrl={props.product.url}
            />
            <div className="text-center p-4">
                {!props.productInfo &&
                <div style={{textAlign: 'right'}}>
                    <i
                        onClick={props.onCloseModal}
                        className="fa fa-times"
                    />
                </div>
                }
                <div style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 5,
                    marginBottom: 7
                }}>
                    <div>
                        {props.product.old_price && props.product.old_price > 0 && (
                            <h6 style={{marginBottom: 0, textDecoration: "line-through"}}>
                                {props.product.old_price} lei
                            </h6>
                        )}
                        {props.product.price && (
                            <h6 className="font-style" style={{marginBottom: 0}}>
                                {props.product.price} lei
                            </h6>
                        )}
                    </div>
                    {shopLogo &&
                    <img
                        style={{
                            maxWidth: 64,
                            maxHeight: 45,
                            marginLeft: 25
                        }}
                        src={shopLogo}
                        alt=''
                        onError={addDefaultImgSrc}
                    />
                    }
                </div>
                <h6>
                    <FormattedMessage
                        id={'product.shop'}
                        defaultMessage="Shop: "
                    />
                    <Link
                        to={Routes.SHOP + '/' + props.product.shopName}
                        style={{color: '#e31f29'}}
                    >
                        {props.product.shopName}
                    </Link>
                </h6>
                <h6>
                    <FormattedMessage
                        id={'product.cashback.money'}
                        defaultMessage="Saved money: "
                    />
                    <span className="font-style">
                        {props.product.commission} lei
                        </span>
                </h6>
                <h6
                    style={
                        props.productInfo
                            ? {}
                            : {maxWidth: 300}
                    }>
                    <FormattedMessage
                        id={'shop.category'}
                        defaultMessage="Category: "
                    />
                    {props.product.category}
                </h6>
                <img
                    style={{maxWidth: 300, maxHeight: 250}}
                    src={props.product.imageUrl}
                    alt={intl.formatMessage({
                        id: 'products.image.missing',
                    })}
                    onError={addDefaultImgSrc}
                />
                <div className="blog_details">
                    <h4
                        style={
                            props.productInfo
                                ? {}
                                : {maxWidth: 300}
                        }>
                        {' '}
                        {props.product.title}
                    </h4>
                    <div
                        className="s_product_text"
                        style={{
                            marginLeft: 10,
                            marginTop: 30,
                        }}
                    >
                        {!props.productInfo &&
                        <div className="card_area" style={{marginBottom: 15}}>
                            <Link to={Routes.PRODUCT_INFO} onClick={() => {
                                props.setCurrentProduct(props.product);
                            }}
                            >
                                <i className="fa fa-info-circle" aria-hidden="true"
                                   style={{marginRight: 5}}/>
                                <FormattedMessage
                                    id={'product.element.more.details'}
                                    defaultMessage="Mai multe detali..."
                                />
                            </Link>
                        </div>
                        }
                        <div className="card_area">{accessButton}</div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


const mapDispatchToProps = (dispatch: any) => {
    return {
        setCurrentProduct: (currentProduct: Product) =>
            dispatch(setCurrentProduct(currentProduct))
    };
};

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
