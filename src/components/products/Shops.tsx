import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Categories from "./Categories";
import {ShopDtoWrapper} from "./ShopDto";
import {connect} from "react-redux";
import Shop from "./Shop";
import {resetShops, setShops} from "../../redux/actions/ShopsAction";
import GenericInput from "../input/GenericInput";

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
        this.onSearchUpdate = this.onSearchUpdate.bind(this);
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
                if (data !== undefined) {
                    this.props.setShops(data);
                }
            });
    }

    public onSearchUpdate(event) {
        if (!event.target.value) {
            this.fetchShops();
        } else {
            DB.collection("shops")
                .where("batch.name", ">=", event.target.value)
                .get()
                .then(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => doc.data() as ShopDtoWrapper);
                    this.props.setShops(data);
                });
        }
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        const shopsList = this.props.shops !== undefined ? this.props.shops.map(shopWrapper => {
            if (shopWrapper.batch !== undefined) {
                return shopWrapper.batch.map(shop => {
                    return <Shop logoSrc={shop.logoPath} name={shop.name} category={shop.category}/>
                })
            }
        }) : null;

        return (
            <React.Fragment>
                <section className="cat_product_area section_gap">
                    <div className="container-fluid">
                        <div className="row flex-row-reverse">
                            <div className="col-lg-9">
                                <div className="product_top_bar">
                                    <GenericInput type={"textfield"} id={"search"} className={"single-input"}
                                                  placeholder={"Search..."} onKeyUp={this.onSearchUpdate}/>
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


