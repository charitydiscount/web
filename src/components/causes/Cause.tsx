import * as React from "react";
import {ImageDto} from "../../rest/CauseService";

interface ICauseProps {
    description: string;
    images: ImageDto[]
    site: string;
    title: string;
}

class Cause extends React.Component<ICauseProps> {

    public render() {
        const imagesList = this.props.images ? this.props.images.map((image, index) => {
            return <img key={this.props.title + index} src={image.url} alt="" width={300} height={300} className="img-fluid"/>
        }) : null;

        return (
            <div className={"p_20"}>
                <h3 className="mb-30 title_color">{this.props.title}</h3>
                <div className="row">
                    <div className="mt-sm-20 left-align-p">
                        <p>{this.props.description}</p>
                    </div>

                    <div>
                        {imagesList}
                    </div>
                </div>
            </div>
        )
    }
}

export default Cause;

