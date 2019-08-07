import {auth, DB} from "../index";
import {ShopDto, ShopDtoWrapper} from "../components/products/ShopDto";
import {setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {FavoriteShopsDto} from "../components/products/FavoriteShopsDto";

export function fetchShops() {
    DB.collection("shops")
        .get()
        .then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
            if (data) {
                var shops = new Array<ShopDto>();
                data.forEach(element => {
                    element.batch.forEach(
                        shop => shops.push(shop))
                    return;
                });
                if (shops) {
                    setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
                }
            }
        });
}

export function fetchFavoriteShops() {
    auth.onAuthStateChanged(function (user) {
            if (user) {
                var docRef = DB.doc("favoriteShops/" + user.uid);
                docRef
                    .get()
                    .then(querySnapshot => {
                        const data = querySnapshot.data() as FavoriteShopsDto;
                        if (data) {
                            if (data.programs) {
                                var favoriteShops = JSON.stringify(data.programs);
                                setLocalStorage(StorageKey.FAVORITE_SHOPS, favoriteShops);
                                return favoriteShops
                            }
                        }
                    });
            }
        }
    );
    return null;
}