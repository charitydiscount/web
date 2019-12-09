import axios from 'axios';
import { auth, remoteConfig } from '../index';
import { computeProductUrl } from '../helper/AppHelper';

export interface RequestResponse {
    hits: ProductWrapper[];
    max_score: number;
    total: ProductTotal;
}

export interface ProductWrapper {
    _source: ProductResponse;
}

export interface ProductTotal {
    value: number;
    relation: string;
}

export interface ProductResponse {
    aff_code: string;
    brand: string;
    campaign_id: number;
    campaign_name: string;
    category: string;
    image_urls: any;
    image_url: any;
    old_price: string;
    price: number;
    product_id: string;
    title: string;
    url: string;
}

export interface ProductSearchInfo {
    productName: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
}

export interface ProductDTO {
    price: number;
    title: string;
    imageUrl: string;
    id: string;
    category: string;
    url: string;
    shopName: string;
    commission?: string;
}

export interface ProductResult {
    products: ProductDTO[];
    total: number;
}

export async function getFeaturedProducts(): Promise<ProductDTO[]> {
    if (!auth.currentUser) {
        return [];
    }

    const token = await auth.currentUser.getIdToken();
    const url = `${remoteConfig.getString(
        'search_endpoint'
    )}/products/featured`;

    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const responseData: RequestResponse = response.data;

    if (!responseData.hits) {
        return [];
    }

    return responseData.hits.map(hit => toProductDTO(hit));
}

export async function searchProduct(
    query: string,
    minPrice: string,
    maxPrice: string,
    sort: string,
    currentPage: number
): Promise<{ products: ProductDTO[]; total: number }> {
    if (!auth.currentUser) {
        return {
            products: [],
            total: 0,
        };
    }

    const token = await auth.currentUser.getIdToken();
    const url = buildSearchUrl(query, sort, minPrice, maxPrice, currentPage);
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const responseData: RequestResponse = response.data;
    if (!responseData.hits) {
        return {
            products: [],
            total: 0,
        };
    }

    return {
        products: responseData.hits.map(hit => toProductDTO(hit)),
        total: responseData.total.value,
    };
}

function buildSearchUrl(
    query: string,
    sort: string,
    minPrice: string,
    maxPrice: string,
    page: number
): string {
    let url = `${remoteConfig.getString(
        'search_endpoint'
    )}/products?query=${query}&page=${page * 50}`;

    if (sort && sort.length > 0) {
        url += '&sort=' + sort;
    }

    if (minPrice) {
        try {
            const minP = parseInt(minPrice);
            if (minP > 0) {
                url += '&min=' + minP;
            }
        } catch (e) {}
    }

    if (maxPrice) {
        try {
            let maxP = parseInt(maxPrice);
            if (maxP > 0) {
                url += '&max=' + maxP;
            }
        } catch (e) {}
    }

    return url;
}

function toProductDTO(productResponse: ProductWrapper): ProductDTO {
    return {
        title: productResponse._source.title,
        id: productResponse._source.product_id,
        price: productResponse._source.price,
        imageUrl: productResponse._source.image_urls.toString().includes(',')
            ? productResponse._source.image_urls.toString().split(',')[0]
            : productResponse._source.image_urls,
        category: productResponse._source.category,
        url: computeProductUrl(productResponse._source.aff_code),
        shopName: productResponse._source.campaign_name,
    };
}
