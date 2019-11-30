import {DB} from "../index";
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {FirebaseTable, StorageKey} from "../helper/Constants";
import {computeUrl, getUserKeyFromStorage} from "../helper/AppHelper";
import {getPercentage} from "./ConfigService";

export interface FavoriteShopsDto {
    programs: ShopDto[],
    userId: string
}

export interface ShopDtoWrapper {
    batch: ShopDto[]
}

export interface ShopDto {
    category: string,
    defaultLeadCommissionAmount: string,
    defaultLeadCommissionType: string,
    defaultSaleCommissionRate: string,
    defaultSaleCommissionType: string,
    logoPath: string,
    mainUrl: string,
    id: number,
    name: string,
    status: string,
    uniqueCode: string,
    averagePaymentTime: number,
    sellingCountries: SellingCountriesDto[],

    //reviews
    totalReviews: number,
    reviewsRating: number,

    //cashback
    commission: string,

    //linkUrl
    computeUrl: string
}

export interface SellingCountriesDto {
    code: string,
    currency: string,
    name: string,
    id: number
}

export var ShopDtoMap = {
    category: "category",
    defaultLeadCommissionAmount: "defaultLeadCommissionAmount",
    defaultLeadCommissionType: "defaultLeadCommissionType",
    defaultSaleCommissionRate: "defaultSaleCommissionRate",
    defaultSaleCommissionType: "defaultSaleCommissionType",
    logoPath: "logoPath",
    mainUrl: "mainUrl",
    id: "id",
    name: "name",
    status: "status",
    uniqueCode: "uniqueCode",
    sellingCountries: "sellingCountries",
    averagePaymentTime: "averagePaymentTime"
};


export function fetchFavoriteShops() {
    return new Promise((resolve, reject) => {
        const favShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
        if (favShops) {
            try {
                let stEntry = JSON.parse(favShops);
                //verify localStorage valid
                if (stEntry.length <= 0 || stEntry[0] === undefined || !stEntry[0].hasOwnProperty("category") ||
                    !stEntry[0].hasOwnProperty("mainUrl") || !stEntry[0].hasOwnProperty("uniqueCode")) {
                    removeLocalStorage(StorageKey.FAVORITE_SHOPS);
                } else {
                    resolve();
                    return;
                }
            } catch (error) {
                removeLocalStorage(StorageKey.FAVORITE_SHOPS);
            }
        }

        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            DB.collection(FirebaseTable.FAVORITE_SHOPS).doc(keyExist).get()
                .then(function (doc) {
                    if (doc.exists) {
                        const data = doc.data() as FavoriteShopsDto;
                        setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(data.programs));
                        resolve();
                    } else {
                        reject();  //object can't be found in DB
                    }
                })
                .catch(() => {
                    reject(); //DB not working
                });
        } else {
            reject(); //not reachable state
        }
    });
}

export function verifyInFavoriteShops(shopId) {
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

export function updateFavoriteShops(favShopName, remove) {
    return new Promise(((resolve, reject) => {
        let keyExist = getUserKeyFromStorage();
        if (keyExist) {
            const shopsStorage = getLocalStorage(StorageKey.SHOPS);
            if (shopsStorage) {
                const shops = JSON.parse(shopsStorage) as Array<ShopDto>;
                if (shops) {
                    let favoriteShop = shops.find(shop => shop.name === favShopName) as ShopDto;
                    if (favoriteShop) {
                        const docRef = DB.collection(FirebaseTable.FAVORITE_SHOPS).doc(keyExist);
                        docRef.get()
                            .then(function (doc) {
                                let favShopList = [] as ShopDto[];
                                if (doc.exists) {
                                    let wholeObject = doc.data() as FavoriteShopsDto;
                                    favShopList = wholeObject.programs as ShopDto[];
                                    if (remove) {
                                        favShopList = favShopList.filter(value => value.name !== favoriteShop.name);
                                    } else {
                                        favShopList.push(favoriteShop);
                                    }
                                    docRef.update({
                                        programs: favShopList
                                    })
                                } else {
                                    // create the document as a list
                                    favShopList.push(favoriteShop);
                                    docRef.set({
                                        programs: favShopList,
                                        userId: keyExist
                                    });
                                }
                                setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(favShopList));
                                setTimeout(function () {
                                    resolve(true);
                                }, 100);
                            })
                            .catch(() => {
                                reject(); //DB not working
                            })
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            } else {
                reject();
            }
        } else {
            reject();
        }
    }))
}

export function fetchShops() {
    return new Promise((resolve, reject) => {
        const shops = getLocalStorage(StorageKey.SHOPS);
        if (shops) {
            try {
                let stEntry = JSON.parse(shops);
                //verify localStorage valid
                if (stEntry.length <= 0 || stEntry[0] === undefined || !stEntry[0].hasOwnProperty("category") ||
                    !stEntry[0].hasOwnProperty("mainUrl") || !stEntry[0].hasOwnProperty("uniqueCode")) {
                    removeLocalStorage(StorageKey.SHOPS);
                } else {
                    resolve(stEntry);
                    return;
                }
            } catch (error) {
                removeLocalStorage(StorageKey.SHOPS);
            }
        }

        DB.collection(FirebaseTable.SHOPS).orderBy('order').get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
                if (data) {
                    let shops = new Array<ShopDto>();
                    let objectMapper = require('object-mapper');
                    data.forEach(element => {
                        element.batch.forEach(
                            shop => {
                                let parsedShop = objectMapper(shop, ShopDtoMap) as ShopDto;

                                //calculate commission
                                let percentage = getPercentage();
                                parsedShop.commission = parsedShop.defaultLeadCommissionAmount != null
                                    ? (
                                    parseFloat(parsedShop.defaultLeadCommissionAmount) *
                                    percentage
                                ).toFixed(2) + ' RON'
                                    : (
                                    parseFloat(parsedShop.defaultSaleCommissionRate) *
                                    percentage
                                ).toFixed(2) + ' %';

                                parsedShop.computeUrl = computeUrl(
                                    parsedShop.uniqueCode,
                                    parsedShop.mainUrl);

                                shops.push(parsedShop)
                            });
                        return;
                    });
                    if (shops) {
                        setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
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
            return value.id === parseInt(id)
        });
    }
}

export function getShopByUniqueCode(uniqueCode) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.uniqueCode === uniqueCode
        });
    }
}

