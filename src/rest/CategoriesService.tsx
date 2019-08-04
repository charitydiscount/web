import {getLocalStorage, setLocalStorage} from "../helper/WebHelper";
import {allCategoriesKey, StorageKey} from "../helper/Constants";
import {CategoryDto} from "../components/products/CategoryDto";
import {DB} from "../index";

export function fetchCategories() {
    DB.collection("categories")
        .get()
        .then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data() as CategoryDto);
            if (data) {
                setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
                return data;
            }
        });
    return null;
}

export function fetchCategoriesForUi(element) {
    const categories = getLocalStorage(StorageKey.CATEGORIES);
    if (categories) {
        element.setState({
            categories: JSON.parse(categories),
            isLoading: false,
            currentCategory: '',
            selections: []
        });
    } else {
        DB.collection("categories")
            .get()
            .then(querySnapshot => {
                let data = [] as CategoryDto[];
                data.push(allCategoriesKey as CategoryDto);
                querySnapshot.docs.forEach(doc => data.push(doc.data() as CategoryDto));
                setLocalStorage(StorageKey.CATEGORIES, JSON.stringify(data));
                if (data) {
                    element.setState({
                        categories: data,
                        isLoading: false,
                        currentCategory: '',
                        selections: []
                    });
                }
            });
    }
}