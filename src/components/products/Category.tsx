import * as React from "react";
import {connect} from "react-redux";
import {ShopDtoWrapper} from "./ShopDto";
import {setShops} from "../../redux/actions/ShopsAction";
import {DB} from "../../index";

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

    public updateShops(event: any) {
        DB.collection("categories")
            .where('category', '==', this.props.name)
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
                this.props.setShops(data);
                this.setState(
                    {
                        isActive: true
                    }
                );
            });
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
        setShops: (shopWrapper: ShopDtoWrapper[]) =>
            dispatch(setShops(shopWrapper)),
    };
};

export default connect(null, mapDispatchToProps)(Category);