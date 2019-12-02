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

export interface ProductSearchInfo {
    productName: string,
    minPrice: string,
    maxPrice: string,
    sort: string
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

export interface ProductResult {
    products: ProductDTO[],
    total: number
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


export function searchProduct(title, minPrice, maxPrice, sort, currentPage) {
    return new Promise(((resolve, reject) => {
        let url = 'https://charity-proxy.appspot.com/search/products?query=' + title;
        url += '&page=' + currentPage * 50;

        if (sort && sort.length > 0) {
            url += '&sort=' + sort;
        }

        try {
            let minP = parseInt(minPrice);
            if (minP > 0) {
                url += '&min=' + minP;
            }
        } catch (e) {
            //min price not loaded
        }

        try {
            let maxP = parseInt(maxPrice);
            if (maxP > 0) {
                url += '&max=' + maxP;
            }
        } catch (e) {
            //max price not loaded
        }


        console.log(url);
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
                            resolve({
                                products: parsedProductList,
                                total: result.total.value
                            } as ProductResult);
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