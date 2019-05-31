import {auth, DB} from "../index";
import {setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {FavoriteShopsDto} from "../components/products/FavoriteShopsDto";

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
                            setLocalStorage(StorageKey.FAVORITE_SHOPS, JSON.stringify(data.programs));
                        }
                    }
                });
        }
    });
}