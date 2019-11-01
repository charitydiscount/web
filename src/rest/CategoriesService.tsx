import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../helper/StorageHelper";
import {FirebaseTable, StorageKey, TableDocument} from "../helper/Constants";
import {DB} from "../index";

export interface CategoryDto {
    category: string
}

export interface CategoriesDBWrapper {
    categories: string[]
}

export function fetchCategories() {
    return new Promise((resolve, reject) => {
        const categories = getLocalStorage(StorageKey.CATEGORIES);
        if (categories) {
            try {
                let stEntry = JSON.parse(categories);
                //verify localStorage valid
                if (stEntry.length <= 0 || stEntry[0] === undefined || !stEntry[0].hasOwnProperty("category")) {
                    removeLocalStorage(StorageKey.CATEGORIES);
                } else {
                    resolve(JSON.parse(categories));
                    return;
                }
            } catch (error) {
                removeLocalStorage(StorageKey.CATEGORIES);
            }
        }

        DB.collection(FirebaseTable.META).doc(TableDocument.PROGRAMS).get().then(doc => {
            if (doc.exists) {
                let data = [] as CategoryDto[];
                data.push({category: "All"});
                var categories = doc.data() as CategoriesDBWrapper;
                categories.categories.forEach(value => data.push({category: value}));
                setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
                if (data) {
                    resolve(data);
                    return;
                }
            } else {
                throw new Error("Fetch error for categories from meta");
            }
        }).catch(() => {
            reject();
        });
    });
}
