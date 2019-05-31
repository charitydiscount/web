import * as React from "react";
import {connect} from "react-redux";
import {ShopDto} from "./ShopDto";
import {setShops} from "../../redux/actions/ShopsAction";
import {getLocalStorage} from "../../helper/WebHelper";
import {StorageKey} from "../../helper/Constants";
import {CategoryDto} from "./CategoryDto";

interface ICategoryState {
    isActive: boolean
}

interface ICategoryProps {
    name: String,

    // global state
    setShops: any
}

class Category extends React.Component<ICategoryProps, ICategoryState> {

    constructor(props: ICategoryProps) {
        super(props);
        this.state = {
            isActive: false
        };
        this.updateShops = this.updateShops.bind(this);
    }

    /**
     * Used to update shops list after a category is selected
     */
    public updateShops() {
        const storage = getLocalStorage(StorageKey.CATEGORIES);
        if (storage) {
            const categories = JSON.parse(storage) as Array<CategoryDto>;
            if (categories) {
                //find the category matching this.props.name
                let resultedCategory = categories.find(category => category.category == this.props.name);
                if (resultedCategory) {
                    if (resultedCategory.category == "All") { // load all shops in this case
                        const shops = getLocalStorage(StorageKey.SHOPS);
                        if (shops) {
                            this.props.setShops(JSON.parse(shops));
                        }
                    } else { //load shops from selected category in this case
                        this.props.setShops(resultedCategory.batch);
                    }
                    this.setState(
                        {
                            isActive: true
                        }
                    );
                }
            }
        }
    }

    public render() {
        const divStyle = {
            color: 'blue'
        };

        return (
            <React.Fragment>
                <li>
                    <a href={"#"} style={this.state.isActive ? divStyle : undefined}
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
    };
};

export default connect(null, mapDispatchToProps)(Category);