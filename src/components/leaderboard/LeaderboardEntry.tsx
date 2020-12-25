import React from "react";
import { LeaderboardEntryDto } from "../../rest/AchievementsService";
import {
    addDefaultImgSrc,
    roundMoney
} from "../../helper/AppHelper";
import { noImagePath } from "../../helper/Constants";
import { getUserId } from "../login/AuthHelper";
import { injectIntl, IntlShape } from "react-intl";

interface LeaderboardEntryProps {
    entry: LeaderboardEntryDto,
    position: number,
    intl: IntlShape;
}

class LeaderboardEntry extends React.Component<LeaderboardEntryProps> {

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
        return (
            <React.Fragment>
                <div className="table-row" key={this.props.position}>
                    <div className="serial">
                        {this.showLeaderboardNumber(this.props.position)}
                    </div>
                    <div className="country" style={{width: "20%"}}>
                        <i className="fa fa-heart" style={{
                            marginRight: "7px",
                            marginLeft: "15px",
                            fontSize: 20,
                            color: "red"
                        }}/>
                        {roundMoney(this.props.entry.points)}
                    </div>
                    <div className="country" style={{width: "14%"}}>
                        <i className="fa fa-trophy" style={{
                            marginRight: "7px",
                            marginLeft: "15px",
                            color: "black"
                        }}/>
                        {this.props.entry.achievementsCount}
                    </div>
                    <div className="percentage" style={{overflow: "auto", maxWidth: 320}}>
                        <img style={{borderRadius: 50, marginRight: 5}}
                             src={this.props.entry.photoUrl ? this.props.entry.photoUrl : noImagePath}
                             width={40}
                             alt="Missing"
                             height={40}
                             onError={addDefaultImgSrc}>
                        </img>
                        <span
                            style={this.props.entry.userId === getUserId() ? {color: "red"} : {}}>{!this.props.entry.name ? 'Anonim' : this.props.entry.name}</span>
                        {this.props.entry.isStaff && <i className="fa fa-user-plus"
                                                        title={this.props.intl.formatMessage({
                                                            id: 'leaderboard.table.staff.member'
                                                        })}
                                                        style={{
                                                            marginLeft: "7px",
                                                            color: "black"
                                                        }}/>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default injectIntl(LeaderboardEntry);
