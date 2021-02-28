import React, { useEffect, useState } from "react";
import { spinnerCss } from "../../../helper/AppHelper";
import { FadeLoader } from "react-spinners";
import { getAchievements, UserAchievementDto } from "../../../rest/AchievementsService";
import AchievementElement from "./AchievementRow";
import { store } from "../../../index";
import { NavigationsAction } from "../../../redux/actions/NavigationsAction";
import { Stages } from "../../helper/Stages";
import AchievementModal from "./AchivementModal";
import { FormattedMessage } from "react-intl";

const Achievements = () => {
    const [achievements, setAchievements] = useState<UserAchievementDto[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        store.dispatch(NavigationsAction.setStageAction(Stages.ACHIEVEMENTS));
        populateAchievements();
    }, []);

    const populateAchievements = async () => {
        try {
            let response = await getAchievements();
            setAchievements(response as UserAchievementDto[]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            //achievements not loaded
        }
    }
    let achievementList = achievements && achievements.length > 0 ?
        achievements.map((userAchievement) => {
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
                        loading={isLoading}
                        color={'#e31f29'}
                        css={spinnerCss}
                    />
                    {!isLoading &&
                    <React.Fragment>
                        <h3 style={{textAlign: "center"}}>
                            <FormattedMessage
                                id="achievements.page.title"
                                defaultMessage="Achievements"
                            />
                        </h3>
                        <FadeLoader
                            loading={isLoading}
                            color={'#e31f29'}
                            css={spinnerCss}
                        />
                        <div className="row achievements">
                            {!isLoading && (
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

export default Achievements;