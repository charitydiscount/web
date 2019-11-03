import {DB} from "../index";
import {getLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {FirebaseTable, StorageKey} from "../helper/Constants";
import {getUserKeyFromStorage} from "../helper/AppHelper";

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
    uniqueCode: string
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
    uniqueCode: "uniqueCode"
};


export function fetchFavoriteShops() {
    return new Promise((resolve, reject) => {
        var keyExist = getUserKeyFromStorage();
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
                }).catch(() => {
                reject(); //DB not working
            });
        }
    });
}

export function verifyInFavoriteShops(shopId) {
    const favoriteShops = getLocalStorage(StorageKey.FAVORITE_SHOPS);
    if (favoriteShops) {
        //TODO: verify in storage is ok
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
                                resolve(true);
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

export function fetchShops(shopsLayout) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        shopsLayout.props.setShops(JSON.parse(shops));
        shopsLayout.setState({
            isLoading: false
        });
    } else {
        DB.collection("shops")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
                if (data) {
                    var shops = new Array<ShopDto>();
                    var objectMapper = require('object-mapper');
                    data.forEach(element => {
                        element.batch.forEach(
                            shop => {
                                let parsedShop = objectMapper(shop, ShopDtoMap);
                                shops.push(parsedShop)
                            });
                        return;
                    });
                    if (shops) {
                        setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
                        shopsLayout.props.setShops(shops);
                        shopsLayout.setState({
                            isLoading: false
                        });
                    }
                }
            });
    }
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

