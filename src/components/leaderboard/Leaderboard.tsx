import React from "react";
import { store } from "../../index";
import { NavigationsAction } from "../../redux/actions/NavigationsAction";
import { Stages } from "../helper/Stages";

interface LeaderboardProps {

}

interface LeaderboardState {

}

class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            achievements: []
        }
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.LEADERBOARD));

    }

    public render() {
        let tableRow = <div className="table-row">
            <div className="serial">01</div>
            <div className="country">
                645032
                <i className="fa fa-heart" style={{
                    marginLeft: "7px",
                    color: "red"
                }}/>
            </div>
            <div className="percentage" style={{overflow: "auto"}}>Lucian Davidescu</div>
        </div>;


        return (
            <React.Fragment>
                <section className="product_description_area section_gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3"/>
                            <div className="col-md-4">
                                <div className="progress-table-wrap">
                                    <div className="progress-table">
                                        <div className="table-head">
                                            <div className="serial">#</div>
                                            <div className="country">Score</div>
                                            <div className="percentage">Name</div>
                                        </div>
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                        {tableRow}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default Leaderboard;