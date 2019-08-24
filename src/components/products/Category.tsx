import * as React from "react";
import {connect} from "react-redux";
import {ShopDto} from "./ShopDto";
import {setCurrentPage, setShops} from "../../redux/actions/ShopsAction";
import {getLocalStorage} from "../../helper/WebHelper";
import {emptyHrefLink, StorageKey} from "../../helper/Constants";
import {CategoryDto} from "../../rest/CategoriesService";


interface ICategoryProps {
    name: String,
    selected : boolean,
    id: string,
    onToggle: (id: String, categoryName: String) => void,

    // global state refresh shops
    setShops?: any,
    setCurrentPage?: any
}

class Category extends React.Component<ICategoryProps> {

    constructor(props: ICategoryProps) {
        super(props);
        this.updateShops = this.updateShops.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    /**
     * This is a function which will trigger parent function to change state
     */
    public onToggle() {
        this.props.onToggle(this.props.id, this.props.name);
    }

    /**
     * Used to update shops list after a category is selected
     */
    public updateShops(e) {
        e.preventDefault(); // prevent default to not point to href location
        const storage = getLocalStorage(StorageKey.CATEGORIES);
        if (storage) {
            const categories = JSON.parse(storage) as Array<CategoryDto>;
            if (categories) {
                //find the category matching this.props.name
                let resultedCategory = categories.find(category => category.category.toLowerCase() === this.props.name.toLowerCase());
                if (resultedCategory) {
                    if (resultedCategory.category === "All") { // load all shops in this case
                        const shops = getLocalStorage(StorageKey.SHOPS);
                        if (shops) {
                            this.props.setShops(JSON.parse(shops));
                            this.props.setCurrentPage(0);
                        }
                    } else { //load shops from selected category in this case
                        // this.props.setShops(resultedCategory.batch);
                        this.props.setCurrentPage(0);
                    }
                    this.onToggle();
                }
            }
        }
        window.scrollTo(0, 0);
    }

    public render() {
        return (
            <React.Fragment>
                <li>
                    <a href={emptyHrefLink} id={this.props.name.toString()}
                       style={this.props.selected ? {color: 'blue'} : undefined}
                       onClick={this.updateShops}>{this.props.name}</a>
                </li>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setShops: (shops: Array<ShopDto>) =>
            dispatch(setShops(shops)),
        setCurrentPage: (currentPage: number) =>
            dispatch(setCurrentPage(currentPage))
    };
};

export default connect(null, mapDispatchToProps)(Category);