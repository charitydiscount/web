import React from 'react';
import Modal from 'react-awesome-modal';
import { UserAchievementDto } from "../../rest/AchievementsService";
import { AppState } from "../../redux/reducer/RootReducer";
import { connect } from "react-redux";
import { setAchievementModalVisible } from "../../redux/actions/AchivementsAction";

export interface AchievementModalProps {

    //global state
    achievementModalVisible: boolean,
    setAchievementModalVisible: (modalVisible) => void
    achievementModal: UserAchievementDto
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

    render() {
        return (
            <Modal
                visible={this.props.achievementModalVisible}
                effect="fadeInUp"
                onClickAway={this.onClose}
            >
                dadadada
            </Modal>
        );
    }
}

const
    mapStateToProps = (state: AppState) => {
        return {
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
