import * as React from "react";
import {ImageDto} from "../../rest/CauseService";

interface ICauseProps {
    description: String;
    images: ImageDto[]
    site: String;
    title: String;
}

class Cause extends React.Component<ICauseProps> {

    public render() {
        var imagesList = this.props.images ? this.props.images.map(image => {
            return <img src={image.url} alt="" width={300} height={300} className="img-fluid"/>
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

