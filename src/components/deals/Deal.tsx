import * as React from "react";

interface IDealProps {
    title: string,
    description: string;
}

class Deal extends React.Component<IDealProps> {

    public render() {
        return (
            <div className="col-lg-4">
                <div className="categories_post">
                    <img src="img/blog/cat-post/cat-post-3.jpg" alt="post"/>
                    <div className="categories_details">
                        <div className="categories_text">
                            <a href="#">
                                <h5>{this.props.title}</h5>
                            </a>
                            <div className="border_line"></div>
                            <p>{this.props.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Deal;


