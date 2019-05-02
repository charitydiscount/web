import * as React from "react";

interface IProductProps {
    logoSrc: string,
    linkHref: string,
    name: string
}

class Product extends React.Component<IProductProps> {

    public render() {
        return (
            <div className="col-lg-3 col-md-3 col-sm-6">
                <div className="f_p_item">
                    <a href={this.props.linkHref}>
                        <div className="f_p_img">
                            <img className="img-fluid" src={this.props.logoSrc} alt=""/>
                        </div>
                        <h4>{this.props.name}</h4>
                    </a>
                </div>
            </div>
        )
    }
}

export default Product;