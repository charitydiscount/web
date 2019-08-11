import {DB} from "../index";
import {ShopDto, ShopDtoWrapper} from "../components/products/ShopDto";
import {getLocalStorage, setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {FavoriteShopsDto} from "../components/products/FavoriteShopsDto";

export function fetchShopsFromLogin() {
    DB.collection("shops")
        .get()
        .then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
            if (data) {
                var shops = new Array<ShopDto>();
                data.forEach(element => {
                    element.batch.forEach(
                        shop => shops.push(shop));
                    return;
                });
                if (shops) {
                    setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
                }
            }
        });
}

export function fetchFavoriteShops(headerLayout) {
    var keyExist = getLocalStorage(StorageKey.USER);
    if (keyExist) {
        var docRef = DB.doc("favoriteShops/" + keyExist);
        docRef
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.data() as FavoriteShopsDto;
                if (data) {
                    if (data.programs) {
                        var favoriteShops = JSON.stringify(data.programs);
                        setLocalStorage(StorageKey.FAVORITE_SHOPS, favoriteShops);
                        headerLayout.props.setShops(JSON.parse(favoriteShops));
                        return;
                    }
                }
            });
    }
    headerLayout.props.setShops(new Array<ShopDto>());
}

export function isInFavoriteShops(shopName) {
    var storageItems = getLocalStorage(StorageKey.FAVORITE_SHOPS_NAME);
    var favoriteShopsName;
    if (storageItems) {
        favoriteShopsName = storageItems.split(",");
    } else {
        var keyExist = getLocalStorage(StorageKey.USER);
        if (keyExist) {
            var docRef = DB.doc("favoriteShops/" + keyExist);
            docRef
                .get()
                .then(querySnapshot => {
                    const data = querySnapshot.data() as FavoriteShopsDto;
                    if (data) {
                        if (data.programs) {
                            favoriteShopsName = data.programs.map(a => a.name);
                            setLocalStorage(StorageKey.FAVORITE_SHOPS_NAME, favoriteShopsName);
                        }
                    }
                });
        }
    }

    if (favoriteShopsName) {
        return favoriteShopsName.includes(shopName);
    }

    return false;
}

