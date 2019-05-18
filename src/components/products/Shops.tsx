import * as React from "react";
import {DB, store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Categories from "./Categories";
import Shop from "./Shop";




class Shops extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));

        const shops = DB.collection('shops')
            .get().then(

            );


        // docRef.get().then();



    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        return (
            <section className="cat_product_area section_gap">
                <div className="container-fluid">
                    <div className="row flex-row-reverse">
                        <div className="col-lg-9">
                            <div className="product_top_bar">
                                <input type={"textfield"} className={"single-input"} placeholder={"Search..."}/>
                            </div>
                            <div className="latest_product_inner row">
                                <Shop logoSrc={"img/product/feature-product/f-p-2.jpg"} name={"Elefant"}/>
                                <Shop logoSrc={"img/product/feature-product/f-p-2.jpg"} name={"Elefant"}/>
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
        )
    }
}

export default Shops;