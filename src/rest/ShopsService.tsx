import {DB} from "../index";
import {ShopDtoWrapper} from "../components/products/ShopDto";
import {setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";

export function fetchShops() {
    DB.collection("shops")
        .get()
        .then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
            if (data) {
                let shops;
                data.forEach(element => {
                    shops = element.batch.entries();
                    return;
                });
                if (shops) {
                    setLocalStorage(StorageKey.SHOPS, JSON.stringify(shops));
                }
            }
        });
}