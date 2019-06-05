import {DB} from "../index";
import {ShopDto, ShopDtoWrapper} from "../components/products/ShopDto";
import {setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";

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