import axios from "axios";
import {auth} from "../index";
import {computeProductUrl} from "../helper/AppHelper";

export interface RequestResponse {
    hits: ProductWrapper[],
    max_score: number,
    total: ProductTotal
}

export interface ProductWrapper {
    _source: ProductResponse
}

export interface ProductTotal {
    value: number,
    relation: string
}

export interface ProductResponse {
    aff_code: string,
    brand: string,
    campaign_id: number,
    campaign_name: string,
    category: string,
    image_urls: any,
    image_url: any,
    old_price: string,
    price: number,
    product_id: string,
    title: string,
    url: string
}


export interface ProductDTO {
    price: number,
    title: string,
    imageUrl: string,
    id: string,
    category: string,
    url: string,
    shopName: string
}

export function getFeaturedProducts() {
    return new Promise(((resolve, reject) => {
        let url = 'https://charity-proxy.appspot.com/search/products/featured';
        auth.onAuthStateChanged(async function (user) {
            if (user) {
                let token = await user.getIdToken(false);
                if (token) {
                    return axios({method: 'get', url: url, headers: {'Authorization': 'Bearer ' + token}})
                        .then((response => {
                            //parse response
                            let parsedProductList = [] as ProductDTO[];
                            let result = response.data as RequestResponse;

                            if (result.hits) {
                                result.hits.forEach(element => {
                                    //parse response
                                    let productResponse = element._source as ProductResponse;
                                    let parsedProduct = {} as ProductDTO;
                                    parsedProduct.title = productResponse.title;
                                    parsedProduct.id = productResponse.product_id;
                                    parsedProduct.price = productResponse.price;
                                    if (productResponse.image_urls !== undefined) {
                                        parsedProduct.imageUrl = productResponse.image_urls.toString().includes(",") ?
                                            productResponse.image_urls.toString().split(",")[0] : productResponse.image_urls;
                                    } else if (productResponse.image_url !== undefined) {
                                        parsedProduct.imageUrl = productResponse.image_url.toString().includes(",") ?
                                            productResponse.image_url.toString().split(",")[0] : productResponse.image_url;
                                    }
                                    parsedProduct.category = productResponse.category;
                                    parsedProduct.url = computeProductUrl(productResponse.aff_code);
                                    parsedProduct.shopName = productResponse.campaign_name;

                                    parsedProductList.push(parsedProduct);
                                });
                            }
                            resolve(parsedProductList);
                        })).catch(() => {
                            reject();
                        });
                } else {
                    reject();
                }
            } else {
                reject();
            }
        });
    }));
}


export function searchProduct(title) {
    return new Promise(((resolve, reject) => {
        let url = 'https://charity-proxy.appspot.com/search/products?query=' + title;
        auth.onAuthStateChanged(async function (user) {
            if (user) {
                let token = await user.getIdToken(false);
                if (token) {
                    return axios({method: 'get', url: url, headers: {'Authorization': 'Bearer ' + token}})
                        .then((response => {
                            //parse response
                            let parsedProductList = [] as ProductDTO[];
                            let result = response.data as RequestResponse;

                            if (result.hits) {
                                result.hits.forEach(element => {
                                    //parse response
                                    let productResponse = element._source as ProductResponse;
                                    let parsedProduct = {} as ProductDTO;
                                    parsedProduct.title = productResponse.title;
                                    parsedProduct.id = productResponse.product_id;
                                    parsedProduct.price = productResponse.price;
                                    if (productResponse.image_urls !== undefined) {
                                        parsedProduct.imageUrl = productResponse.image_urls.toString().includes(",") ?
                                            productResponse.image_urls.toString().split(",")[0] : productResponse.image_urls;
                                    } else if (productResponse.image_url !== undefined) {
                                        parsedProduct.imageUrl = productResponse.image_url.toString().includes(",") ?
                                            productResponse.image_url.toString().split(",")[0] : productResponse.image_url;
                                    }
                                    parsedProduct.category = productResponse.category;
                                    parsedProduct.url = computeProductUrl(productResponse.aff_code);
                                    parsedProduct.shopName = productResponse.campaign_name;

                                    parsedProductList.push(parsedProduct);
                                });
                            }
                            resolve(parsedProductList);
                        })).catch(() => {
                            reject();
                        });
                } else {
                    reject();
                }
            } else {
                reject();
            }
        });
    }));
}