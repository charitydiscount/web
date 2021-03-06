import * as React from 'react';
import { Product } from '../../../rest/ProductsService';
import Modal from 'react-awesome-modal';
import ProductElement from './ProductElement';
import { add3Dots, addDefaultImgSrc, getImagePath, keyDownEscapeEvent } from "../../../helper/AppHelper";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { ShopDto } from "../../../rest/ShopsService";
import { useEffect, useState } from "react";

interface ProductListElementProps {
    keyElement: string,
    product: Product,
    allShops: ShopDto[],
    comingFromShop: boolean
}

const ProductList = (props: ProductListElementProps) => {

    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        keyDownEscapeEvent(() => setVisible(false));
    }, []);

    let shopFound = props.allShops.find((shop) => shop.id === Number(props.product.shopId));
    let shopLogo;
    if (shopFound) {
        shopLogo = shopFound.logoPath;
    }

    return (
        <React.Fragment>
            <Modal
                visible={visible}
                effect="fadeInUp"
                onClickAway={() => setVisible(false)}
            >
                <ProductElement
                    key={'element' + props.keyElement}
                    productInfo={false}
                    onCloseModal={() => setVisible(false)}
                    product={props.product}
                />
            </Modal>
            <div
                className={props.comingFromShop ? "col-md-6 shop-container" : "col-md-4 shop-container"}
                onClick={() => setVisible(true)}
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
                            {props.product.old_price && props.product.old_price > 0 && (
                                <h6 style={{marginBottom: 0, textDecoration: "line-through"}}>
                                    {props.product.old_price} lei
                                </h6>
                            )}
                            {props.product.price && (
                                <h6 className="font-style" style={{
                                    marginBottom: 0,
                                    padding: props.product.old_price ?
                                        "0px 5px 5px 5px" :
                                        5
                                }}>
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
                            alt="Missing"
                            src={getImagePath(shopLogo)}
                            onError={addDefaultImgSrc}
                        />
                        }
                    </div>
                    <div className="shop-image-container" style={{marginBottom: 0, padding: 0}}>
                        <div
                            className="shop-image"
                            style={{backgroundImage: 'url("' + props.product.imageUrl + '")'}}
                        />
                    </div>
                    <div className="shop-description-container"
                         style={{overflow: 'auto', padding: "0px 30px 0px 30px", maxHeight: 90}}>
                        <h4>
                            {add3Dots(props.product.title, 35)}
                        </h4>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
        allShops: state.shops.allShops
    };
};

export default connect(mapStateToProps)(ProductList);

