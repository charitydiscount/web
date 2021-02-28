import React from "react";
import { UserAchievementDto } from "../../../rest/AchievementsService";
import { connect } from "react-redux";
import { Badge } from "@material-ui/core";
import { AchievementActions } from "../../../redux/actions/AchivementsAction";
import { ftAwCheck } from "../../../helper/FontAwesomeHelper";
import { Languages } from "../../../helper/Constants";

interface AchievementElementProps {
    userAchievement: UserAchievementDto;
    locale: string;
    setUserAchievement: (achievement) => void;
}

const AchievementRow = (props: AchievementElementProps) => {

    const openModal = () => {
        props.setUserAchievement(props.userAchievement);
    };

    let achievementName = props.locale === Languages.RO
        ? props.userAchievement.achievement.name.ro : props.userAchievement.achievement.name.en

    return (
        <React.Fragment>
            <div
                className="col-md-2 col-xl-2 achievement-container"
                onClick={openModal}
                style={{cursor: "pointer"}}
            >
                <div className="f_p_item achievement_no_image">
                    <div className="achievement-image-container">
                        <Badge color="primary" badgeContent={props.userAchievement.achievement.reward.amount}>
                            <img
                                className={"achievement-image"}
                                src={props.userAchievement.achievement.badgeUrl} alt=""
                            />
                        </Badge>
                    </div>
                    <div className="achievement-description-container">
                        <div className="description">
                            {achievementName}
                        </div>
                    </div>
                    {props.userAchievement.achieved &&
                    <i className={ftAwCheck}/>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state: any) => {
    return {
        locale: state.locale.langResources.language
    }
};

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            setUserAchievement: (achievement: UserAchievementDto) =>
                dispatch(AchievementActions.setAchievementModal(achievement))
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(AchievementRow);
