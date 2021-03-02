import React from "react";
import { LeaderboardEntryDto } from "../../../rest/AchievementsService";
import {
    addDefaultImgSrc,
    roundMoney
} from "../../../helper/AppHelper";
import { noImagePath } from "../../../helper/Constants";
import { getUserId } from "../login/AuthHelper";
import { injectIntl, IntlShape } from "react-intl";

interface LeaderboardEntryProps {
    entry: LeaderboardEntryDto,
    position: number,
    intl: IntlShape;
}

const LeaderboardEntry = (props: LeaderboardEntryProps) => {

    const showLeaderboardNumber = (position: number) => {
        if (position === 0) {
            return <i className="fa fa-trophy fa-2x" style={{color: "gold", fontSize: 25}}/>;
        } else if (position === 1) {
            return <i className="fa fa-trophy" style={{color: "silver", fontSize: 25}}/>;
        } else if (position === 2) {
            return <i className="fa fa-trophy" style={{color: "#cd7f32", fontSize: 25}}/>;
        }
        return position + 1;
    }

    return (
        <React.Fragment>
            <div className="table-row" key={props.position}>
                <div className="serial">
                    {showLeaderboardNumber(props.position)}
                </div>
                <div className="country" style={{width: "20%"}}>
                    <i className="fa fa-heart" style={{
                        marginRight: "7px",
                        fontSize: 20,
                        color: "red"
                    }}/>
                    {roundMoney(props.entry.points)}
                </div>
                <div className="country" style={{width: "14%"}}>
                    <i className="fa fa-trophy" style={{
                        marginRight: "7px",
                        color: "black"
                    }}/>
                    {props.entry.achievementsCount}
                </div>
                <div className="percentage" style={{overflow: "auto", maxWidth: 320}}>
                    <img style={{borderRadius: 50, marginRight: 5}}
                         src={props.entry.photoUrl ? props.entry.photoUrl : noImagePath}
                         width={40}
                         alt="Missing"
                         height={40}
                         onError={addDefaultImgSrc}>
                    </img>
                    <span
                        style={props.entry.userId === getUserId() ? {color: "red"} : {}}>
                        {!props.entry.name ? 'Anonim' : props.entry.name}
                    </span>
                    {props.entry.isStaff && <i className="fa fa-user-plus"
                                               title={props.intl.formatMessage({
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
};


export default injectIntl(LeaderboardEntry);
