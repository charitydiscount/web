import React from "react";
import { spinnerCss } from "../../../helper/AppHelper";
import { FadeLoader } from "react-spinners";
import { getAchievements, UserAchievementDto } from "../../../rest/AchievementsService";
import AchievementElement from "./AchievementRow";
import { store } from "../../../index";
import { NavigationsAction } from "../../../redux/actions/NavigationsAction";
import { Stages } from "../../helper/Stages";
import AchievementModal from "./AchivementModal";
import { FormattedMessage } from "react-intl";

interface AchievementsProps {

}

interface AchievementsState {
    achievements: UserAchievementDto[],
    isLoading: boolean
}

class Achievements extends React.Component<AchievementsProps, AchievementsState> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            achievements: []
        }
    }

    async componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.ACHIEVEMENTS));
        try {
            let response = await getAchievements();
            if (response) {
                this.setState({
                    achievements: response as UserAchievementDto[],
                    isLoading: false
                });
            }
        } catch (error) {
            //achievements not loaded
        }
    }

    public render() {
        let achievementList = this.state.achievements && this.state.achievements.length > 0 ?
            this.state.achievements.map((userAchievement) => {
                return (
                    <AchievementElement
                        key={'list' + userAchievement.achievement.id}
                        userAchievement={userAchievement}
                    />
                );
            }) : [];

        return (
            <React.Fragment>
                <AchievementModal/>
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
                                    id="achievements.page.title"
                                    defaultMessage="Achievements"
                                />
                            </h3>
                            <FadeLoader
                                loading={this.state.isLoading}
                                color={'#e31f29'}
                                css={spinnerCss}
                            />
                            <div className="row achievements">
                                {!this.state.isLoading && (
                                    <React.Fragment>
                                        {achievementList}
                                    </React.Fragment>
                                )}
                            </div>
                        </React.Fragment>
                        }
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default Achievements;