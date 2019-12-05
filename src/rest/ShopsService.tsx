import { DB } from '../index';
import {
    getLocalStorage,
    removeLocalStorage,
    setLocalStorage,
} from '../helper/StorageHelper';
import { FirebaseTable, StorageKey } from '../helper/Constants';
import { computeUrl, getUserKeyFromStorage } from '../helper/AppHelper';
import { getPercentage } from './ConfigService';
import { firestore } from 'firebase/app';

export interface FavoriteShopsDto {
    programs: { [shopUniqueCode: string]: ShopDto };
    userId: string;
}

export interface ShopDtoWrapper {
    batch: ShopDto[];
}

export interface ShopDto {
    category: string;
    defaultLeadCommissionAmount: string;
    defaultLeadCommissionType: string;
    defaultSaleCommissionRate: string;
    defaultSaleCommissionType: string;
    logoPath: string;
    mainUrl: string;
    id: number;
    name: string;
    status: string;
    uniqueCode: string;
    averagePaymentTime: number;
    sellingCountries: SellingCountriesDto[];

    //reviews
    totalReviews: number;
    reviewsRating: number;

    //cashback
    commission: string;

    //linkUrl
    computeUrl: string;
}

export interface SellingCountriesDto {
    code: string;
    currency: string;
    name: string;
    id: number;
}

export var ShopDtoMap = {
    category: 'category',
    defaultLeadCommissionAmount: 'defaultLeadCommissionAmount',
    defaultLeadCommissionType: 'defaultLeadCommissionType',
    defaultSaleCommissionRate: 'defaultSaleCommissionRate',
    defaultSaleCommissionType: 'defaultSaleCommissionType',
    logoPath: 'logoPath',
    mainUrl: 'mainUrl',
    id: 'id',
    name: 'name',
    status: 'status',
    uniqueCode: 'uniqueCode',
    sellingCountries: 'sellingCountries',
    averagePaymentTime: 'averagePaymentTime',
};

export async function fetchFavoriteShops() {
    const userKey = getUserKeyFromStorage();
    if (!userKey) {
        return [];
    }
    const favoriteShopsDoc = await DB.collection(FirebaseTable.FAVORITE_SHOPS)
        .doc(userKey)
        .get();
    if (!favoriteShopsDoc.exists) {
        return [];
    }

    const favoriteShops = Object.values(
        (favoriteShopsDoc.data() as FavoriteShopsDto).programs
    );
    setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(favoriteShops));

    return favoriteShops;
}

export function verifyInFavoriteShops(shopId: number) {
    const favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
    if (favoriteShops) {
        let favShops = JSON.parse(favoriteShops) as ShopDto[];
        let shopFound = favShops.find(value => value.id === shopId);
        if (shopFound) {
            return true;
        }
    }
    return false;
}

export async function updateFavoriteShops(shop: ShopDto, remove: boolean) {
    const userKey = getUserKeyFromStorage();
    if (!userKey) {
        return;
    }

    const docRef = DB.collection(FirebaseTable.FAVORITE_SHOPS).doc(userKey);
    if (remove) {
        return docRef.update({
            [`programs.${shop.uniqueCode}`]: firestore.FieldValue.delete(),
        });
    } else {
        const favoriteShopsDoc = await docRef.get();
        if (favoriteShopsDoc.exists) {
            return docRef.update({
                [`programs.${shop.uniqueCode}`]: shop,
            });
        } else {
            return docRef.set({
                userId: userKey,
                [`programs.${shop.uniqueCode}`]: shop,
            });
        }
    }
}

export function fetchShops() {
    return new Promise((resolve, reject) => {
        const shops = getLocalStorage(StorageKey.SHOPS);
        if (shops) {
            try {
                let stEntry = JSON.parse(shops);
                //verify localStorage valid
                if (
                    stEntry.length <= 0 ||
                    stEntry[0] === undefined ||
                    !stEntry[0].hasOwnProperty('category') ||
                    !stEntry[0].hasOwnProperty('mainUrl') ||
                    !stEntry[0].hasOwnProperty('uniqueCode')
                ) {
                    removeLocalStorage(StorageKey.SHOPS);
                } else {
                    resolve(stEntry);
                    return;
                }
            } catch (error) {
                removeLocalStorage(StorageKey.SHOPS);
            }
        }

        DB.collection(FirebaseTable.SHOPS)
            .orderBy('order')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(
                    doc => doc.data() as ShopDtoWrapper
                );
                if (data) {
                    let shops = new Array<ShopDto>();
                    let objectMapper = require('object-mapper');
                    data.forEach(element => {
                        element.batch.forEach(shop => {
                            let parsedShop = objectMapper(
                                shop,
                                ShopDtoMap
                            ) as ShopDto;

                            //calculate commission
                            let percentage = getPercentage();
                            parsedShop.commission =
                                parsedShop.defaultLeadCommissionAmount != null
                                    ? (
                                          parseFloat(
                                              parsedShop.defaultLeadCommissionAmount
                                          ) * percentage
                                      ).toFixed(2) + ' RON'
                                    : (
                                          parseFloat(
                                              parsedShop.defaultSaleCommissionRate
                                          ) * percentage
                                      ).toFixed(2) + ' %';

                            parsedShop.computeUrl = computeUrl(
                                parsedShop.uniqueCode,
                                parsedShop.mainUrl
                            );

                            shops.push(parsedShop);
                        });
                        return;
                    });
                    if (shops) {
                        setLocalStorage(
                            StorageKey.SHOPS,
                            JSON.stringify(shops)
                        );
                        resolve(shops);
                    } else {
                        reject(); //shops not found
                    }
                }
            })
            .catch(() => {
                reject(); //DB not working.
            });
    });
}

export function getShopById(id) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.id === parseInt(id);
        });
    }
}

export function getShopByUniqueCode(uniqueCode) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.uniqueCode === uniqueCode;
        });
    }
}

export function getShopByName(name) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.name === name;
        });
    }
}
