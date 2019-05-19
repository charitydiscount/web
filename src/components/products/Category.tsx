import * as React from "react";

interface ICategoryState {

}

interface ICategoryProps {
    name: String
}

class Category extends React.Component<ICategoryProps, ICategoryState> {

    constructor(props: ICategoryProps) {
        super(props);
    }

    public render() {
        return <li>
            <a href="#">{this.props.name}</a>
        </li>
    }
}

export default Category;