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

    public updateShops() {
        const storage = getLocalStorage(StorageKey.CATEGORIES);
        if (storage) {
            const categories = JSON.parse(storage) as Array<CategoryDto>;
            if (categories) {
                const resultedCategory = categories.filter(category => category.category == this.props.name);
                if (resultedCategory) {
                    this.props.setShops(resultedCategory);
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