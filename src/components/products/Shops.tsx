import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Categories from "./Categories";
import {ShopDtoWrapper} from "./ShopDto";
import {connect} from "react-redux";
import Shop from "./Shop";
import {resetShops, setShops} from "../../redux/actions/ShopsAction";

interface IShopsProps {
    shops: ShopDtoWrapper[],

    // global state
    setShops: any,
    resetShops: any,
}

interface IShopsState {
    isLoading: boolean
}


class Shops extends React.Component<IShopsProps, IShopsState> {

    constructor(props: IShopsProps) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.fetchShops = this.fetchShops.bind(this);
    }

    public componentDidMount() {
        this.fetchShops();
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }

    public fetchShops() {
        DB.collection("shops")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
                this.props.setShops(data);
            });
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        const shopsList = this.props.shops.map(shopWrapper => {
            return shopWrapper.batch.map(shop => {
                return <Shop logoSrc={shop.logoPath} name={shop.name}/>
            })
        });

        return (
            <React.Fragment>
                <section className="cat_product_area section_gap">
                    <div className="container-fluid">
                        <div className="row flex-row-reverse">
                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <input type={"textfield"} className={"single-input"} placeholder={"Search..."}/>
                                </div>
                                <div className="latest_product_inner row">
                                    {shopsList}
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="left_sidebar_area">
                                    <Categories/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        shops: state.shopReducer.shops
    };
};


const mapDispatchToProps = (dispatch: any) => {
    return {
        setShops: (shopWrapper: ShopDtoWrapper[]) =>
            dispatch(setShops(shopWrapper)),
        resetIncidents: () => dispatch(resetShops()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Shops);


