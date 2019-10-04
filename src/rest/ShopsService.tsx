import {DB} from "../index";
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {StorageKey} from "../helper/Constants";
import {LoginDto} from "../components/login/LoginComponent";

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
    defaultSaleCommissionRate: number,
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
    defaultSaleCommissionRate: "defaultSaleCommissionRate",
    logoPath: "logoPath",
    mainUrl: "mainUrl",
    id: "id",
    name: "name",
    status: "status",
    uniqueCode: "uniqueCode"
};


export function fetchFavoriteShops(headerLayout) {
    var user = getLocalStorage(StorageKey.USER);
    if (user) {
        var keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            var docRef = DB.collection("favoriteShops").doc(keyExist);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    const data = doc.data() as FavoriteShopsDto;
                    setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(data.programs));
                    headerLayout.props.setShops(data.programs);
                    return;
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }
    headerLayout.props.setShops(new Array<ShopDto>());
}

export function isInFavoriteShops(shopdId, shopLayout) {
    var storageItems = getLocalStorage(StorageKey.FAVORITE_SHOPS_ID);
    var fShopsId;
    if (storageItems) {
        fShopsId = storageItems.split(",");
    } else {
        var user = getLocalStorage(StorageKey.USER);
        if (user) {
            var keyExist = (JSON.parse(user) as LoginDto).uid;
            if (keyExist) {
                var docRef = DB.collection("favoriteShops").doc(keyExist);
                docRef.get().then(function (doc) {
                    if (doc.exists) {
                        const data = doc.data() as FavoriteShopsDto;
                        fShopsId = data.programs.map(fs => fs.id);
                        setLocalStorage(StorageKey.FAVORITE_SHOPS_ID, fShopsId);
                        if (fShopsId && fShopsId.includes(shopdId)) {
                            shopLayout.state = ({
                                favShop: true
                            });
                            return;
                        }
                    }
                });
            }
        }
    }

    if (fShopsId && fShopsId.includes("" + shopdId)) {
        shopLayout.state = {
            favShop: true
        };
    }
}

export function updateFavoriteShops(name, remove) {
    var user = getLocalStorage(StorageKey.USER);
    if (user) {
        var keyExist = (JSON.parse(user) as LoginDto).uid;
        if (keyExist) {
            const shopsStorage = getLocalStorage(StorageKey.SHOPS);
            if (shopsStorage) {
                const shops = JSON.parse(shopsStorage) as Array<ShopDto>;
                if (shops) {
                    let favoriteShop = shops.find(shop => shop.name === name) as ShopDto;
                    if (favoriteShop) {
                        var docRef = DB.collection("favoriteShops").doc(keyExist);
                        docRef.get().then(function (doc) {
                            if (doc.exists) {
                                let wholeObject = doc.data() as FavoriteShopsDto;
                                var favoriteShops = wholeObject.programs as ShopDto[];
                                if (remove) {
                                    favoriteShops = favoriteShops.filter(value => value.name !== favoriteShop.name);
                                } else {
                                    favoriteShops.push(favoriteShop);
                                }
                                docRef.update({
                                    programs: favoriteShops
                                })
                            } else {
                                // create the document as a list
                                var favShops = [] as ShopDto[];
                                favShops.push(favoriteShop);
                                docRef.set({
                                    programs: favShops,
                                    userId: keyExist
                                })
                            }
                            removeLocalStorage(StorageKey.FAVORITE_SHOPS);
                            removeLocalStorage(StorageKey.FAVORITE_SHOPS_ID);
                        });
                    }
                }
            }
        }
    }
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
            return value.id == id
        });
    }
}

export function getShopByUniqueCode(uniquedCode) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        const shopsParsed = JSON.parse(shops) as Array<ShopDto>;
        return shopsParsed.find(value => {
            return value.uniqueCode == uniquedCode
        });
    }
}

