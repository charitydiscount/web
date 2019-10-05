import * as React from "react";
import {emptyHrefLink} from "../../helper/Constants";

interface CauseDonateProps {
    causeTitle: string
    onUpdate: (id: string) => void,
    selections : boolean[]
}

interface CauseDonateState {
    active: boolean
}

class CauseDonate extends React.Component<CauseDonateProps, CauseDonateState> {

    constructor(props: CauseDonateProps) {
        super(props);
        this.state = {
            active: false
        };
        this.onUpdate = this.onUpdate.bind(this);
    }

    public onUpdate() {
        this.props.onUpdate(this.props.causeTitle);
    }

    public render() {
        return (
            <React.Fragment>
                <li className={this.props.selections[this.props.causeTitle] ? 'active' : ''}>
                    <a href={emptyHrefLink} onClick={() => this.onUpdate()}>
                        {this.props.causeTitle}
                    </a>
                </li>
            </React.Fragment>
        )
    }
}

export default CauseDonate;

