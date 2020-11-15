import React from "react";
import { AchievementDto } from "../../rest/AchievementsService";
import { StorageRef } from "../../helper/Constants";
import { storage } from "../../index";

interface AchievementElementProps {
    achievement: AchievementDto;
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
                .ref(StorageRef.BADGES + this.props.achievement.badge)
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
        return (
            <React.Fragment>
                <div
                    className="col-md-4 shop-container"
                    onClick={() => {
                    }}
                    style={{cursor: 'pointer'}}
                >
                    <div className="f_p_item shop_no_image">
                        <div className="shop-description-container" style={{padding: 5}}>
                            <h6 className="comission">
                                {this.props.achievement.name.ro}
                            </h6>
                        </div>
                        <img style={{
                            width: 64,
                            height: 64
                        }}
                             src={this.state.achievementUrl} alt=""
                        />
                        <div className="shop-description-container" style={{padding: 5}}>
                                {this.props.achievement.description.ro}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AchievementElement;