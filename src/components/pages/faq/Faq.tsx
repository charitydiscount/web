import * as React from "react";
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import FaqRO from "./FaqRO";
import FaqEN from "./FaqEN";
import { Languages } from "../../../helper/Constants";

interface IFaqProps {
    locale: string
}

const Faq = (props: IFaqProps) => {
    return (
        <React.Fragment>
            <div className="container p_90">
                <div className="p-2 p-md-4">
                    <h3 className="mb-30 title_color">
                        <FormattedMessage
                            id="faq.title"
                            defaultMessage="FAQ"
                        />
                    </h3>
                    <div className="mt-sm-20 left-align-p">
                        {props.locale === Languages.RO ? <FaqRO/> : <FaqEN/>}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const
    mapStateToProps = (state: any) => {
        return {
            locale: state.locale.langResources.language
        }
    };

export default connect(mapStateToProps)(Faq);