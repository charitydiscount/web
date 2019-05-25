import {setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {CategoryDto} from "../components/products/CategoryDto";
import {DB} from "../index";

export function fetchCategories() {
    DB.collection("categories")
        .get()
        .then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data() as CategoryDto);
            if (data) {
                setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
            }
        });
}
