import React from "react";
import { UserAchievementDto } from "../../rest/AchievementsService";
import { StorageRef } from "../../helper/Constants";
import { storage } from "../../index";
import {
    achievementPhotoLoading,
} from "../../helper/AppHelper";
import { FadeLoader } from "react-spinners";
import { connect } from "react-redux";

interface AchievementElementProps {
    userAchievement: UserAchievementDto;

    //global state
    currentLocale: string
}

interface AchievementElementState {
    achievementUrl: string,
    isLoadingPhoto: boolean
}

class AchievementElement extends React.Component<AchievementElementProps, AchievementElementState> {

    constructor(props) {
        super(props);
        this.state = {
            achievementUrl: '',
            isLoadingPhoto: false
        }
    }

    async componentDidMount() {
        try {
            const response = await storage
                .ref(StorageRef.BADGES + this.props.userAchievement.achievement.badge)
                .getDownloadURL();
            this.setState({
                achievementUrl: response as string,
                isLoadingPhoto: false
            });
        } catch (error) {
            this.setState({
                isLoadingPhoto: false
            });
        }
    }

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
                <div
                    className="col-md-2"
                    onClick={() => {
                    }}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item">
                        <FadeLoader
                            loading={this.state.isLoadingPhoto}
                            color={'#e31f29'}
                            css={achievementPhotoLoading}
                        />
                        {!this.state.isLoadingPhoto &&
                        <img
                            className={imageCssClass}
                            style={{
                                width: 64,
                                height: 64
                            }}
                            src={this.state.achievementUrl} alt=""
                        />
                        }
                        <div style={{marginTop: 5}}>
                            <h6>
                                {achievementName}
                            </h6>
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

export default connect(mapStateToProps)(AchievementElement);
