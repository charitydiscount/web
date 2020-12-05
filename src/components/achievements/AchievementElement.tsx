import React from "react";
import { UserAchievementDto } from "../../rest/AchievementsService";
import { connect } from "react-redux";
import { setAchievementModal } from "../../redux/actions/AchivementsAction";
import AchievementModal from "./AchivementModal";

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
        let imageCssClass = "";
        if (!this.props.userAchievement.achieved) {
            imageCssClass = "grayscale_img";
        }
        let achievementName;
        if (this.props.currentLocale === "ro") {
            achievementName = this.props.userAchievement.achievement.name.ro;
        } else {
            achievementName = this.props.userAchievement.achievement.name.en;
        }

        return (
            <React.Fragment>
                <AchievementModal/>
                <div
                    className="col-md-2 col-xl-2 achievement-container"
                    onClick={this.openModal}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item achievement_no_image">
                        <div className="achievement-image-container">
                            <img
                                className={"achievement-image " + imageCssClass}
                                src={this.props.userAchievement.achievement.badgeUrl} alt=""
                            />
                        </div>
                        <div className="achievement-description-container">
                            <div className="description">
                                {achievementName}
                            </div>
                        </div>
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
