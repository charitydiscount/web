import {getLocalStorage, setLocalStorage} from "../helper/WebHelper";
import {StorageKey} from "../helper/Constants";
import {DB} from "../index";

export function fetchCategories(categoriesLayout) {
    const categories = getLocalStorage(StorageKey.CATEGORIES);
    if (categories) {
        categoriesLayout.setState({
            categories: JSON.parse(categories),
            isLoading: false,
        });
    } else {
        var docRef = DB.collection("meta").doc("programs");
        docRef.get().then(function (doc) {
            if (doc.exists) {
                let data = [] as CategoryDto[];
                data.push({category: "All"});
                var categories = doc.data() as CategoriesDBWrapper;
                categories.categories.forEach(value => data.push({category: value}));
                setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
                if (data) {
                    categoriesLayout.setState({
                        categories: data,
                        isLoading: false,
                    });
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

export interface CategoryDto {
    category: string
}

export interface CategoriesDBWrapper {
    categories: string[]
}
