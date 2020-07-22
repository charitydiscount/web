import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl, IntlShape } from 'react-intl';
import { ProductDTO } from '../../rest/ProductsService';
import { Redirect } from 'react-router';
import { Routes } from '../helper/Routes';
import { emptyHrefLink, StorageKey } from '../../helper/Constants';
import RedirectModal from "../shops/RedirectModal";
import { getLocalStorage } from "../../helper/StorageHelper";
import { clickSaveAndRedirect } from "../../rest/ClickService";

interface ProductElementProps {
    intl: IntlShape;
    product: ProductDTO;
    onCloseModal: () => void;
}

interface ProductElementState {
    redirect: boolean;
    redirectModalVisible: boolean
}

class ProductElement extends React.Component<ProductElementProps,
    ProductElementState> {

    constructor(props: Readonly<ProductElementProps>) {
        super(props);

        this.state = {
            redirect: false,
            redirectModalVisible: false,
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
                    to={
                        Routes.SHOP +
                        '/' +
                        this.props.product.shopName
                    }
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
        if (redirectStorageKey && redirectStorageKey === "true") {
            accessButton =  <a
                href={emptyHrefLink}
                onClick={(event) => {clickSaveAndRedirect(event, this.props.product.shopId, this.props.product.url)}}
                rel="noopener noreferrer"
                className="main_btn"
            >
                <FormattedMessage
                    id={'shop.access.button'}
                    defaultMessage="Access"
                />
            </a>
        } else {
            accessButton = <a
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
        }

        return (
            <React.Fragment>
                {this.renderRedirect()}
                <RedirectModal visible={this.state.redirectModalVisible}
                               programId={this.props.product.shopId}
                               onCloseModal={this.closeRedirectModal}
                               cashbackUrl={this.props.product.url}/>
                <div className="text-center p-4">
                    <div style={{ textAlign: 'right' }}>
                        <i
                            onClick={this.props.onCloseModal}
                            className="fa fa-times"
                        />
                    </div>
                    {this.props.product.price && (
                        <h6 className="product-price">
                            {this.props.product.price} lei
                        </h6>
                    )}
                    <h6>
                        <FormattedMessage
                            id={'product.shop'}
                            defaultMessage="Shop: "
                        />
                        <a
                            href={emptyHrefLink}
                            onClick={this.setRedirect}
                            style={{ color: '#1641ff' }}
                        >
                            {this.props.product.shopName}
                        </a>
                    </h6>
                    <h6>
                        <FormattedMessage
                            id={'product.cashback.money'}
                            defaultMessage="Saved money: "
                        />
                        {this.props.product.commission} lei
                    </h6>
                    <h6 style={{ maxWidth: 300 }}>
                        <FormattedMessage
                            id={'shop.category'}
                            defaultMessage="Category: "
                        />
                        {this.props.product.category}
                    </h6>
                    <img
                        style={{ maxWidth: 300, maxHeight: 300 }}
                        src={this.props.product.imageUrl}
                        alt={this.props.intl.formatMessage({
                            id: 'products.image.missing',
                        })}
                    />
                    <div className="blog_details">
                        <h4 style={{ maxWidth: 300 }}>
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
                            <div className="card_area">
                                {accessButton}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default injectIntl(ProductElement);
