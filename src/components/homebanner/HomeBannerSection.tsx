import * as React from "react";

export interface IHomeBannerSectionProps {
    isOverlay?: boolean;
    link ?: string;
    linkText ?: string;
    pageTitle: string;
}

class HomeBannerSection extends React.Component<IHomeBannerSectionProps> {

    render(): React.ReactNode {
        return (
            <section className="banner_area">
                {this.props.isOverlay && <div className="overlay"></div>}
                <div className="banner_inner d-flex align-items-center">
                    <div className="container">
                        <div className="banner_content text-center">
                            <h2>{this.props.pageTitle}</h2>
                            {this.props.link && this.props.linkText &&
                                <div className="page_link">
                                    <a href="/">Home</a>
                                    <a href={this.props.link}>{this.props.linkText}</a>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default HomeBannerSection;