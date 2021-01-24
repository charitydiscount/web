import * as React from 'react';
import { Product } from '../../rest/ProductsService';
import Modal from 'react-awesome-modal';
import ProductElement from './ProductElement';
import { injectIntl, IntlShape } from 'react-intl';
import { add3Dots, addDefaultImgSrc } from "../../helper/AppHelper";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { ShopDto } from "../../rest/ShopsService";

interface ProductListElementState {
    visible: boolean;
}

interface ProductListElementProps {
    intl: IntlShape,
    keyElement: string,
    product: Product,
    allShops: ShopDto[]
}

class ProductListElement extends React.Component<ProductListElementProps,
    ProductListElementState> {
    constructor(props: ProductListElementProps) {
        super(props);
        this.state = {
            visible: false
        };
        document.addEventListener('keydown', this.escFunction, false);
    }

    escFunction = (event) => {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    };

    closeModal = () => {
        this.setState({
            visible: false
        });
    };

    openModal = () => {
        this.setState({
            visible: true
        });
    };

    public render() {
        let shopFound = this.props.allShops.find((shop) =>
            shop.id === Number(this.props.product.shopId)
        );
        let shopLogo;
        if (shopFound) {
            shopLogo = shopFound.logoPath;
        }
        return (
            <React.Fragment>
                <Modal
                    visible={this.state.visible}
                    effect="fadeInUp"
                    onClickAway={this.closeModal}
                >
                    <ProductElement
                        key={'element' + this.props.keyElement}
                        productInfo={false}
                        onCloseModal={this.closeModal}
                        product={this.props.product}
                    />
                </Modal>
                <div
                    className="col-md-4 shop-container"
                    onClick={this.openModal}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item shop" style={{height: 230}}>
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            marginTop: 5,
                            marginBottom: 5
                        }}>
                            <div>
                                {this.props.product.old_price && this.props.product.old_price > 0 && (
                                    <h6 style={{marginBottom: 0, textDecoration: "line-through"}}>
                                        {this.props.product.old_price} lei
                                    </h6>
                                )}
                                {this.props.product.price && (
                                    <h6 className="font-style" style={{
                                        marginBottom: 0,
                                        padding: this.props.product.old_price ?
                                            "0px 5px 5px 5px" :
                                            5
                                    }}>
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
                        <div className="shop-image-container" style={{marginBottom: 0, padding: 0}}>
                            <div
                                className="shop-image"
                                style={{backgroundImage: 'url("' + this.props.product.imageUrl + '")'}}
                            />
                        </div>
                        <div className="shop-description-container"
                             style={{overflow: 'auto', padding: "0px 30px 0px 30px", maxHeight: 90}}>
                            <h4>
                                {add3Dots(this.props.product.title, 50)}
                            </h4>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops
    };
};

export default connect(mapStateToProps)(injectIntl(ProductListElement));

