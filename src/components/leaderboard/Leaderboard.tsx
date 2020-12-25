import React from "react";
import { store } from "../../index";
import { NavigationsAction } from "../../redux/actions/NavigationsAction";
import { Stages } from "../helper/Stages";
import { FormattedMessage } from "react-intl";
import { getLeaderboard, LeaderboardEntryDto } from "../../rest/AchievementsService";
import { addDefaultImgSrc, roundMoney, spinnerCss } from "../../helper/AppHelper";
import { injectIntl, IntlShape } from 'react-intl';
import { FadeLoader } from "react-spinners";
import { getUserId } from "../login/AuthHelper";
import { noImagePath } from "../../helper/Constants";

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

    showLeaderboardNumber(position: number) {
        if (position === 0) {
            return <i className="fa fa-trophy fa-2x" style={{color: "gold", fontSize: 25}}/>;
        } else if (position === 1) {
            return <i className="fa fa-trophy" style={{color: "silver", fontSize: 25}}/>;
        } else if (position === 2) {
            return <i className="fa fa-trophy" style={{color: "#cd7f32", fontSize: 25}}/>;
        }

        return position + 1;
    }

    public render() {
        let leaderboard;
        if (this.state.leaderboardEntries && this.state.leaderboardEntries.length > 0) {
            leaderboard = this.state.leaderboardEntries.map((entry, position) => {
                return <div className="table-row" key={position}>
                    <div className="serial">
                        {this.showLeaderboardNumber(position)}
                    </div>
                    <div className="country" style={{width: "20%"}}>
                        <i className="fa fa-heart" style={{
                            marginRight: "7px",
                            marginLeft: "15px",
                            fontSize: 20,
                            color: "red"
                        }}/>
                        {roundMoney(entry.points)}
                    </div>
                    <div className="country" style={{width: "14%"}}>
                        <i className="fa fa-trophy" style={{
                            marginRight: "7px",
                            marginLeft: "15px",
                            color: "black"
                        }}/>
                        {entry.achievementsCount}
                    </div>
                    <div className="percentage" style={{overflow: "auto", maxWidth: 320}}>
                        <img style={{borderRadius: 50, marginRight: 5}}
                             src={entry.photoUrl ? entry.photoUrl : noImagePath}
                             width={40}
                             alt="Missing"
                             height={40}
                             onError={addDefaultImgSrc}>
                        </img>
                        <span
                            style={entry.userId === getUserId() ? {color: "red"} : {}}>{!entry.name ? 'Anonym' : entry.name}</span>
                        {entry.isStaff && <i className="fa fa-user-plus"
                                             title={this.props.intl.formatMessage({
                                                 id: 'leaderboard.table.staff.member'
                                             })}
                                             style={{
                                                 marginLeft: "7px",
                                                 color: "black"
                                             }}/>
                        }
                    </div>
                </div>;
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
                                        <div className="progress-table">
                                            <div className="table-head">
                                                <div className="serial" style={{fontSize: 14}}>#</div>
                                                <div className="country" style={{width: "20%", fontSize: 14}}>Charity Points</div>
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
