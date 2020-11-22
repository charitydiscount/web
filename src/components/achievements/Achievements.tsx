import React from "react";
import { spinnerCss } from "../../helper/AppHelper";
import { FadeLoader } from "react-spinners";
import { getAchievements, UserAchievementDto } from "../../rest/AchievementsService";
import AchievementElement from "./AchievementElement";
import { store } from "../../index";
import { NavigationsAction } from "../../redux/actions/NavigationsAction";
import { Stages } from "../helper/Stages";

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
            isLoading: false,
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
                <section className="product_description_area section_gap">
                    <div className="container">
                        <FadeLoader
                            loading={this.state.isLoading}
                            color={'#e31f29'}
                            css={spinnerCss}
                        />
                        <div className="row">
                            {!this.state.isLoading && (
                                <React.Fragment>
                                    {achievementList}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}

export default Achievements;