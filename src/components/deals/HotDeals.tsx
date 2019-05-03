import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import Deal from "./Deal";

class HotDeals extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.DEALS));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.DEALS));
    }

    public render() {
        return (
            <section className="blog_categorie_area">
                <div className="container">
                    <div className="row">
                        <Deal title={"Social Life"} description={"Enjoy your social life together"}/>
                        <Deal title={"Social Life"} description={"Enjoy your social life together"}/>
                        <Deal title={"Social Life"} description={"Enjoy your social life together"}/>
                        <Deal title={"Social Life"} description={"Enjoy your social life together"}/>
                        <Deal title={"Social Life"} description={"Enjoy your social life together"}/>
                        <Deal title={"Social Life"} description={"Enjoy your social life together"}/>
                    </div>
                </div>
            </section>
        )
    }
}

export default HotDeals;


