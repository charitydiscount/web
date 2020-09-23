import { CategoryDto, fetchCategories } from "../../../rest/CategoriesService";
import { ShopDto } from "../../../rest/ShopsService";
import * as React from "react";
import { ImportantCategoryDto } from "../../../rest/ConfigService";

export interface ICategoriesProps {
    currentCategory?: String; // used for showing the current category in a label which is visual
    selections?: boolean[]; // map used to activate the right category

    //global state
    setCurrentCategory?: any; // used for setting current category
    setSelections?: any; // used for showing a blue color when a category is activated
}

export interface ICategoriesState {
    categories: CategoryDto[];
    isLoading?: boolean;
    importantCategories?: ImportantCategoryDto[];
}

export interface ICategoryState {
    photoURL: string
}

export interface ICategoryProps {
    name: string;
    photoName?: string;
    selected: boolean;
    id: string; // id used for selections map
    onToggle: (id: String, categoryName: String) => void; // used for calling the parent function

    // global state refresh shops
    setShops?: any;
    setCurrentPage?: any;
    allShops: ShopDto[];
}


export async function loadCategories(component){
    try {
        let response = await fetchCategories();
        component.setState({
            categories: response as CategoryDto[],
            isLoading: false,
        });
    } catch (error) {
        component.setState({
            isLoading: true,
        });
    }
}

export function onChildToggle(component, id, name){
    let selections = [] as boolean[];
    selections[id] = true;

    component.props.setSelections(selections);
    component.props.setCurrentCategory(name);
}

/**
 * Used to update shops list after a category is selected
 */
export function updateShops(component, event: React.MouseEvent) {
    event.preventDefault(); // prevent default to not point to href location
    if (component.props.name === 'All') {
        // load all shops in this case
        component.props.setShops(component.props.allShops);
        component.props.setCurrentPage(0);
    } else {
        //load shops from selected category in this case
        const result = component.props.allShops.filter(
            shop =>
                shop.category.toLowerCase() ===
                component.props.name.toLowerCase()
        );
        component.props.setShops(result);
        component.props.setCurrentPage(0);
    }
    component.onToggle();
    window.scrollTo(0, 0);
}
