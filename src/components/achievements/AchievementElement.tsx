import React from "react";
import { UserAchievementDto } from "../../rest/AchievementsService";
import { connect } from "react-redux";
import { setAchievementModal } from "../../redux/actions/AchivementsAction";
import { Badge } from "@material-ui/core";

interface AchievementElementProps {
    userAchievement: UserAchievementDto;

    //global state
    currentLocale: string,
    setAchievementModal: (achievement) => void
}

interface AchievementElementState {
}

class AchievementElement extends React.Component<AchievementElementProps, AchievementElementState> {

    openModal = () => {
        this.props.setAchievementModal(this.props.userAchievement);
    };

    public render() {
        let achievementName;
        if (this.props.currentLocale === "ro") {
            achievementName = this.props.userAchievement.achievement.name.ro;
        } else {
            achievementName = this.props.userAchievement.achievement.name.en;
        }

        return (
            <React.Fragment>
                <div
                    className="col-md-2 col-xl-2 achievement-container"
                    onClick={this.openModal}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item achievement_no_image">
                        <div className="achievement-image-container">
                            <Badge color="primary" badgeContent={this.props.userAchievement.achievement.reward.amount}>
                                <img
                                    className={"achievement-image"}
                                    src={this.props.userAchievement.achievement.badgeUrl} alt=""
                                />
                            </Badge>
                        </div>
                        <div className="achievement-description-container">
                            <div className="description">
                                {achievementName}
                            </div>
                        </div>
                        {this.props.userAchievement.achieved &&
                        <i className="fa fa-check"/>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        currentLocale: state.locale.langResources.language
    }
};

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            setAchievementModal: (achievement: UserAchievementDto) =>
                dispatch(setAchievementModal(achievement))
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(AchievementElement);
