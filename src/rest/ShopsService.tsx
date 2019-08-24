import {DB} from "../index";
import {ShopDto, ShopDtoMap, ShopDtoWrapper} from "../components/products/ShopDto";
import {getLocalStorage, setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";

export interface FavoriteShopsDto {
    programs: ShopDto[],
    userId: string
}

export function fetchFavoriteShops(headerLayout) {
    var keyExist = getLocalStorage(StorageKey.USER);
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
    headerLayout.props.setShops(new Array<ShopDto>());
}

export function isInFavoriteShops(shopdId, shopLayout) {
    var storageItems = getLocalStorage(StorageKey.FAVORITE_SHOPS_ID);
    var fShopsId;
    if (storageItems) {
        fShopsId = storageItems.split(",");
    } else {
        var keyExist = getLocalStorage(StorageKey.USER);
        if (keyExist) {
            var docRef = DB.doc("favoriteShops/" + keyExist);
            docRef.get()
                .then(querySnapshot => {
                    const data = querySnapshot.data() as FavoriteShopsDto;
                    if (data) {
                        if (data.programs) {
                            fShopsId = data.programs.map(fs => fs.id);
                            setLocalStorage(StorageKey.FAVORITE_SHOPS_ID, fShopsId);
                            if (fShopsId && fShopsId.includes(shopdId)) {
                                shopLayout.setState({
                                    favShop: true
                                });
                            }
                        }
                    }
                });
        }
    }

    if (fShopsId && fShopsId.includes("" + shopdId)) {
        shopLayout.state = {
            favShop: true
        };
    }
}

export function fetchShops(shopLayout) {
    const shops = getLocalStorage(StorageKey.SHOPS);
    if (shops) {
        shopLayout.props.setShops(JSON.parse(shops));
        shopLayout.setState({
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
                        shopLayout.props.setShops(shops);
                        shopLayout.setState({
                            isLoading: false
                        });
                    }
                }
            });
    }
}

