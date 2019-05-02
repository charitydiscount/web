import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";

class ProductInfo extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.PRODUCT));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.PRODUCT));
    }


    public render() {
        return (
            <div className="product_image_area">
                <div className="container">
                    <div className="row s_product_inner">
                        <div className="col-lg-6">
                            <div className="s_product_img">
                                <img className="d-block w-100"
                                     src="img/product/single-product/s-product-1.jpg"
                                     alt="Third slide"/>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            <div className="s_product_text">
                                <h3>Faded SkyBlu Denim Jeans</h3>
                                <ul className="list">
                                    <li>
                                        <a className="active" href="#">
                                            <span>Category</span> : Household</a>
                                    </li>
                                </ul>
                                <p>Mill Oil is an innovative oil filled radiator with the most modern technology. If you
                                    are looking
                                    for something that
                                    can make your interior look awesome, and at the same time give you the pleasant warm
                                    feeling
                                    during the winter.</p>
                                <div className="card_area">
                                    <a className="main_btn" href="#">Access</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductInfo;