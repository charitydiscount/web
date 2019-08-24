import {DB} from "../index";
import {ShopDto} from "../components/products/ShopDto";
import {getLocalStorage, setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {FavoriteShopsDto} from "../components/products/FavoriteShopsDto";

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

