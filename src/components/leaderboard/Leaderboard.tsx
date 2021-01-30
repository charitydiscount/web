import React from "react";
import { store } from "../../index";
import { NavigationsAction } from "../../redux/actions/NavigationsAction";
import { Stages } from "../helper/Stages";
import { FormattedMessage } from "react-intl";
import { getLeaderboard, LeaderboardEntryDto } from "../../rest/AchievementsService";
import { spinnerCss } from "../../helper/AppHelper";
import { injectIntl, IntlShape } from 'react-intl';
import { FadeLoader } from "react-spinners";
import LeaderboardEntry from "./LeaderboardEntry";

interface LeaderboardProps {
    intl: IntlShape;
}

interface LeaderboardState {
    isLoading: boolean,
    leaderboardEntries: LeaderboardEntryDto[]
}

class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            leaderboardEntries: []
        }
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.LEADERBOARD));
        try {
            let response = await getLeaderboard();
            this.setState({
                leaderboardEntries: response as LeaderboardEntryDto[],
                isLoading: false
            })
        } catch (e) {
            //leaderboard entries not loaded
        }
    }

    public render() {
        let leaderboard;
        if (this.state.leaderboardEntries && this.state.leaderboardEntries.length > 0) {
            leaderboard = this.state.leaderboardEntries.map((entry, position) => {
                return <LeaderboardEntry key={"key" + position} entry={entry} position={position}/>
            });
        }

        return (
            <React.Fragment>
                <section className="product_description_area section_gap">
                    <div className="container">
                        <FadeLoader
                            loading={this.state.isLoading}
                            color={'#e31f29'}
                            css={spinnerCss}
                        />
                        {!this.state.isLoading &&
                        <React.Fragment>
                            <h3 style={{textAlign: "center"}}>
                                <FormattedMessage
                                    id="leaderboard.page.title"
                                    defaultMessage="Leaderboard"
                                />
                            </h3>
                            <div className="row">
                                <div className="col-md-3"/>
                                <div className="col-md-3">
                                    <div className="progress-table-wrap">
                                        <div className="progress-table" style={{textAlign: "center"}}>
                                            <div className="table-head">
                                                <div className="serial" style={{fontSize: 14}}>#</div>
                                                <div className="country" style={{width: "20%", fontSize: 14}}>Charity
                                                    Points
                                                </div>
                                                <div className="country" style={{width: "14%", fontSize: 14}}>
                                                    <FormattedMessage
                                                        id="leaderboard.table.achievements"
                                                        defaultMessage="Realizari"
                                                    />
                                                </div>
                                                <div className="percentage" style={{fontSize: 14}}>
                                                    <FormattedMessage
                                                        id="leaderboard.table.name"
                                                        defaultMessage="Utilizator"
                                                    />
                                                </div>
                                            </div>
                                            {leaderboard}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                        }
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default injectIntl(Leaderboard);
