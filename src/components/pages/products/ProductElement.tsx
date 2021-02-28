import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl, IntlShape } from 'react-intl';
import { Product } from '../../../rest/ProductsService';
import { Redirect } from 'react-router';
import { Routes } from '../../helper/Routes';
import { emptyHrefLink, StorageKey } from '../../../helper/Constants';
import RedirectModal from '../shops/RedirectModal';
import { getLocalStorage } from '../../../helper/StorageHelper';
import { clickSaveAndRedirect } from "../../../rest/ClickService";
import { addDefaultImgSrc } from "../../../helper/AppHelper";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { ShopDto } from "../../../rest/ShopsService";
import { setCurrentProduct } from "../../../redux/actions/ProductsAction";

interface ProductElementProps {
    intl: IntlShape;
    product: Product;
    productInfo: boolean;
    onCloseModal?: () => void;
    allShops: ShopDto[],
    setCurrentProduct: Function
}

interface ProductElementState {
    redirect: boolean;
    productInfoRedirect: boolean;
    redirectModalVisible: boolean;
}

class ProductElement extends React.Component<ProductElementProps,
    ProductElementState> {
    constructor(props: Readonly<ProductElementProps>) {
        super(props);

        this.state = {
            redirect: false,
            productInfoRedirect: false,
            redirectModalVisible: false
        };
    }

    setRedirect = () => {
        this.setState({
            redirect: true,
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return (
                <Redirect
                    to={Routes.SHOP + '/' + this.props.product.shopName}
                />
            );
        }
    };

    renderProductInfoRedirect = () => {
        if (this.state.productInfoRedirect) {
            this.props.setCurrentProduct(this.props.product);
            return (
                <Redirect
                    to={Routes.PRODUCT_INFO}
                />
            );
        }
    };

    openRedirectModal = () => {
        this.setState({
            redirectModalVisible: true,
        });
    };

    closeRedirectModal = () => {
        this.setState({
            redirectModalVisible: false,
        });
    };

    public render() {
        let accessButton;
        let redirectStorageKey = getLocalStorage(StorageKey.REDIRECT_MESSAGE);
        if (redirectStorageKey && redirectStorageKey === 'true') {
            accessButton = (
                <a
                    href={emptyHrefLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                        clickSaveAndRedirect(event, this.props.product.shopId, this.props.product.url)
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
                    onClick={this.openRedirectModal}
                >
                    <FormattedMessage
                        id={'shop.access.button'}
                        defaultMessage="Access"
                    />
                </a>
            );
        }

        let shopFound = this.props.allShops.find((shop) =>
            shop.id === Number(this.props.product.shopId)
        );
        let shopLogo;
        if (shopFound) {
            shopLogo = shopFound.logoPath;
        }

        return (
            <React.Fragment>
                {this.renderRedirect()}
                {this.renderProductInfoRedirect()}
                <RedirectModal
                    visible={this.state.redirectModalVisible}
                    programId={this.props.product.shopId}
                    onCloseModal={this.closeRedirectModal}
                    cashbackUrl={this.props.product.url}
                />
                <div className="text-center p-4">
                    {!this.props.productInfo &&
                    <div style={{textAlign: 'right'}}>
                        <i
                            onClick={this.props.onCloseModal}
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
                            {this.props.product.old_price && this.props.product.old_price > 0 &&(
                                <h6 style={{marginBottom: 0, textDecoration: "line-through"}}>
                                    {this.props.product.old_price} lei
                                </h6>
                            )}
                            {this.props.product.price && (
                                <h6 className="font-style" style={{marginBottom: 0}}>
                                    {this.props.product.price} lei
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
                        <a
                            href={emptyHrefLink}
                            onClick={this.setRedirect}
                            style={{color: '#e31f29'}}
                        >
                            {this.props.product.shopName}
                        </a>
                    </h6>
                    <h6>
                        <FormattedMessage
                            id={'product.cashback.money'}
                            defaultMessage="Saved money: "
                        />
                        <span className="font-style">
                        {this.props.product.commission} lei
                        </span>
                    </h6>
                    <h6
                        style={
                            this.props.productInfo
                                ? {}
                                : {maxWidth: 300}
                        }>
                        <FormattedMessage
                            id={'shop.category'}
                            defaultMessage="Category: "
                        />
                        {this.props.product.category}
                    </h6>
                    <img
                        style={{maxWidth: 300, maxHeight: 250}}
                        src={this.props.product.imageUrl}
                        alt={this.props.intl.formatMessage({
                            id: 'products.image.missing',
                        })}
                        onError={addDefaultImgSrc}
                    />
                    <div className="blog_details">
                        <h4
                            style={
                                this.props.productInfo
                                    ? {}
                                    : {maxWidth: 300}
                            }>
                            {' '}
                            {this.props.product.title}
                        </h4>
                        <div
                            className="s_product_text"
                            style={{
                                marginLeft: 10,
                                marginTop: 30,
                            }}
                        >
                            {!this.props.productInfo &&
                            <div className="card_area" style={{marginBottom: 15}}>
                                <a href={emptyHrefLink} onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({
                                        productInfoRedirect: true
                                    })
                                }}
                                >
                                    <i className="fa fa-info-circle" aria-hidden="true"
                                       style={{marginRight: 5}}/>
                                    <FormattedMessage
                                        id={'product.element.more.details'}
                                        defaultMessage="Mai multe detali..."
                                    />
                                </a>
                            </div>
                            }
                            <div className="card_area">{accessButton}</div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ProductElement));
