import React from "react";
import { spinnerCss } from "../../helper/AppHelper";
import { FadeLoader } from "react-spinners";
import { AchievementDto, getAchievements } from "../../rest/AchievementsService";
import AchievementElement from "./AchievementElement";

interface AchievementsProps {

}

interface AchievementsState {
    achievements: AchievementDto[],
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
        try {
            let response = await getAchievements();
            if (response) {
                this.setState({
                    achievements: response as AchievementDto[],
                    isLoading: false
                });
            }
        } catch (error) {
            //achievements not loaded
        }
    }

    public render() {
        let achievementList = this.state.achievements && this.state.achievements.length > 0 ?
            this.state.achievements.map((achievement) => {
                return (
                    <AchievementElement
                        key={'list' + achievement.id}
                        achievement={achievement}
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
                        <div
                            className="latest_product_inner row d-flex align-items-stretch shops-container shade-container">
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