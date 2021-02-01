import { roundCommission } from "../../helper/AppHelper";
import ProductListElement from "./ProductListElement";
import * as React from "react";
import { ShopDto } from "../../rest/ShopsService";
import { Product } from "../../rest/ProductsService";

/**
 * Filter after active products, product's shop present in our shops list
 */
export function filterProducts(products: Product[], shops: ShopDto[], comingFromShop: boolean) {
    let productsState;
    productsState = products
        .filter(
            (product) =>
                shops.find(
                    (shop) => shop.id.toString() === product.shopId
                ) !== undefined
        )
        .map((product) => {
            let shop = shops.find(
                (shop) => shop.id.toString() === product.shopId
            );
            if (shop) {
                product.commission = roundCommission(
                    (product.price * parseFloat(shop.commission)) / 100
                );
            }
            return product;
        });

    return productsState && productsState.length > 0
        ? productsState.map((product, index) => {
            return (
                <ProductListElement
                    key={'list' + index}
                    keyElement={'list' + index}
                    product={product}
                    comingFromShop={comingFromShop}
                />
            );
        })
        : null;
}