import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";

class Categories extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CATEGORIES));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CATEGORIES));
    }

    public render() {
        return (
            <aside className="left_widgets cat_widgets">
                <div className="l_w_title">
                    <h3>Browse Categories</h3>
                </div>
                <div className="widgets_inner">
                    <ul className="list">
                        <li>
                            <a href="#">Fruits and Vegetables</a>
                        </li>
                        <li>
                            <a href="#">Meat and Fish</a>
                        </li>
                        <li>
                            <a href="#">Cooking</a>
                        </li>
                        <li>
                            <a href="#">Beverages</a>
                        </li>
                        <li>
                            <a href="#">Home and Cleaning</a>
                        </li>
                    </ul>
                </div>
            </aside>
        )
    }
}


export default Categories;
