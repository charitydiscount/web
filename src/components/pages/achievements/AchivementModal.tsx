import React from 'react';
import Modal from 'react-awesome-modal';
import { UserAchievementDto } from "../../../rest/AchievementsService";
import { AppState } from "../../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { AchievementActions } from "../../../redux/actions/AchivementsAction";
import { Slider } from "@material-ui/core";
import { dateOptions, getImagePath } from "../../../helper/AppHelper";
import { Languages } from "../../../helper/Constants";

export interface AchievementModalProps {
    //global state
    modalVisible: boolean,
    setModalVisible: (modalVisible) => void,
    userAchievement: UserAchievementDto,
    locale: string
}

const AchievementModal = (props: AchievementModalProps) => {

    const onClose = () => {
        props.setModalVisible(false);
    };

    const valueText = (value) => {
        return `${value}`;
    };

    let achievementName;
    let achievementDescription;
    let sliderTarget;
    let marks;
    let imageCssClass;
    let bottomPart;

    if (props.modalVisible) {
        if (props.locale === Languages.RO) {
            achievementName = props.userAchievement.achievement.name.ro;
            achievementDescription = props.userAchievement.achievement.description.ro;
        } else {
            achievementName = props.userAchievement.achievement.name.en;
            achievementDescription = props.userAchievement.achievement.description.en;
        }
        props.userAchievement.achievement.conditions.forEach(condition => {
            if (condition.type === "count") {
                sliderTarget = condition.target;
            }
        });

        if (props.userAchievement.currentCount) {
            marks = [
                {
                    value: props.userAchievement.currentCount,
                    label: props.userAchievement.currentCount,
                },
            ];
        }

        if (!props.userAchievement.achieved) {
            imageCssClass = "grayscale_img";
        }

        if (props.userAchievement.achieved) {
            bottomPart =
                <React.Fragment>
                    {props.userAchievement.achievedAt
                        .toDate()
                        .toLocaleDateString('ro-RO', dateOptions) + " "}
                    <i className="fa fa-check"/>
                </React.Fragment>
        } else {
            if (sliderTarget > 1) {
                bottomPart = <Slider
                    defaultValue={props.userAchievement.currentCount}
                    getAriaValueText={valueText}
                    aria-labelledby="discrete-slider-custom"
                    valueLabelDisplay="auto"
                    marks={marks}
                    min={0}
                    max={sliderTarget}
                    disabled
                />
            }
        }
    }

    return (
        <Modal
            visible={props.modalVisible}
            effect="fadeInUp"
            onClickAway={onClose}
        >
            {props.modalVisible &&
            <React.Fragment>
                <div className="text-center p-4">
                    <div style={{textAlign: 'right'}}>
                        <i
                            onClick={onClose}
                            className="fa fa-times"
                        />
                    </div>

                    <h4 className="cashback-text" style={{marginBottom: 15}}>
                            <span className="blue-color">{props.userAchievement.achievement.reward.amount
                            + " " + props.userAchievement.achievement.reward.unit}</span>
                        <br/>
                    </h4>
                    <img
                        src={getImagePath(props.userAchievement.achievement.badgeUrl)}
                        alt="Missing"
                        className={imageCssClass}
                        style={{
                            maxWidth: 200,
                            maxHeight: 200,
                        }}
                    />
                    <div className="blog_details">
                        <h4 style={{maxWidth: 300, maxHeight: 150}}>
                            {achievementName}
                        </h4>
                        <h6
                            style={{
                                maxWidth: 300,
                                maxHeight: 250,
                                overflow: 'auto',
                            }}
                        >
                            {achievementDescription}
                        </h6>
                        {bottomPart}
                    </div>
                </div>
            </React.Fragment>
            }
        </Modal>
    );
}

const
    mapStateToProps = (state: AppState) => {
        return {
            locale: state.locale.langResources.language,
            modalVisible: state.achievement.modalVisible,
            userAchievement: state.achievement.achievementModal
        };
    };

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            setModalVisible: (modalVisible: boolean) =>
                dispatch(AchievementActions.setAchievementModalVisible(modalVisible))
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(AchievementModal);
