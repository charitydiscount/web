import * as React from "react";
import {Stages} from "../helper/Stages";
import {connect} from "react-redux";
import HomeBannerSection from "../homebanner/HomeBannerSection";

interface IHomeBannerProps {
    view: string,
}

class HomeBanner extends React.Component<IHomeBannerProps> {

    public render() {
        switch (this.props.view) {
            case Stages.LOGIN:
                return <HomeBannerSection link={"/login"} linkText={"Login"} pageTitle={"Login/Register"}/>;
            case Stages.CONTACT:
                return <HomeBannerSection link={"/contact"} linkText={"Contact"} pageTitle={"Contact Us"}/>;
            case Stages.CATEGORIES:
                return <HomeBannerSection link={"/categories"} linkText={"Categories"}
                                          pageTitle={"Shop Category Page"}/>;
            default:
                return <HomeBannerSection pageTitle={"Welcome"} isOverlay={true}/>;
        }
    }
}

const mapStateToProps = (state: any) => {
    return {
        view: state.navigation.stageName,
    }
};

export default connect(mapStateToProps)(HomeBanner);
