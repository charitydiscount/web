import React from 'react';
import Modal from 'react-awesome-modal';
import { UserAchievementDto } from "../../rest/AchievementsService";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { setAchievementModalVisible } from "../../redux/actions/AchivementsAction";
import { Slider } from "@material-ui/core";

export interface AchievementModalProps {

    //global state
    achievementModalVisible: boolean,
    setAchievementModalVisible: (modalVisible) => void,
    achievementModal: UserAchievementDto,
    currentLocale: string
}

interface AchievementModalState {
    isLoading: boolean
}

class AchievementModal extends React.Component<AchievementModalProps, AchievementModalState> {

    constructor(props: Readonly<AchievementModalProps>) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    onClose = () => {
        this.setState({
            isLoading: false
        });
        this.props.setAchievementModalVisible(false);
    };

    valueText = (value) => {
        return `${value}`;
    };

    render() {
        let achievementName;
        let achievementDescription;
        let sliderTarget;
        let marks;
        if (this.props.achievementModalVisible) {
            if (this.props.currentLocale === "ro") {
                achievementName = this.props.achievementModal.achievement.name.ro;
                achievementDescription = this.props.achievementModal.achievement.description.ro;
            } else {
                achievementName = this.props.achievementModal.achievement.name.en;
                achievementDescription = this.props.achievementModal.achievement.description.en;
            }
            this.props.achievementModal.achievement.conditions.forEach(condition => {
                if (condition.type === "count") {
                    sliderTarget = condition.target;
                }
            });

            if (this.props.achievementModal.currentCount) {
                marks = [
                    {
                        value: this.props.achievementModal.currentCount,
                        label: this.props.achievementModal.currentCount,
                    },
                ];
            }
        }


        return (
            <Modal
                visible={this.props.achievementModalVisible}
                effect="fadeInUp"
                onClickAway={this.onClose}
            >
                {this.props.achievementModalVisible &&
                <React.Fragment>
                    <div className="text-center p-4">
                        <div style={{textAlign: 'right'}}>
                            <i
                                onClick={this.onClose}
                                className="fa fa-times"
                            />
                        </div>

                        <h4 className="cashback-text" style={{marginBottom: 15}}>
                            <span className="blue-color">{this.props.achievementModal.achievement.reward.amount
                            + " " + this.props.achievementModal.achievement.reward.unit}</span>
                            <br/>
                        </h4>
                        <img
                            src={this.props.achievementModal.achievement.badgeUrl}
                            alt=""
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
                            {sliderTarget > 1 &&
                            <Slider
                                defaultValue={this.props.achievementModal.currentCount}
                                getAriaValueText={this.valueText}
                                aria-labelledby="discrete-slider-custom"
                                valueLabelDisplay="auto"
                                marks={marks}
                                min={0}
                                max={sliderTarget}
                                disabled
                            />
                            }
                        </div>
                    </div>
                </React.Fragment>
                }
            </Modal>
        );
    }
}

const
    mapStateToProps = (state: AppState) => {
        return {
            currentLocale: state.locale.langResources.language,
            achievementModalVisible: state.achievement.modalVisible,
            achievementModal: state.achievement.achievementModal
        };
    };

const
    mapDispatchToProps = (dispatch: any) => {
        return {
            setAchievementModalVisible: (modalVisible: boolean) =>
                dispatch(setAchievementModalVisible(modalVisible))
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(AchievementModal);
