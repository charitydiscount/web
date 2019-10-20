import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {emptyHrefLink, InputType} from "../../helper/Constants";
import GenericInput from "../input/GenericInput";
import {FormattedMessage} from 'react-intl';
import {InjectedIntlProps, injectIntl} from "react-intl";

interface IContactProps {
}

interface IContactState {
    name: string,
    email: string,
    subject: string,
    message: string
}

class Contact extends React.Component<IContactProps & InjectedIntlProps, IContactState> {

    constructor(props: IContactProps & InjectedIntlProps) {
        super(props);
        this.state = {
            name: "",
            email: "",
            subject: "",
            message: ""
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CONTACT));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CONTACT));
    }

    public handleNameChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    public handleEmailChange(event) {
        this.setState({
            email: event.target.value
        })
    }

    public handleSubjectChange(event) {
        this.setState({
            subject: event.target.value
        })
    }

    public handleMessageChange(event) {
        this.setState({
            message: event.target.value
        })
    }

    public handleSendMessage(event) {
        alert(this.state.message);
    }

    public render() {
        return (
            <section className="contact_area p_120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="contact_info">
                                <div className="info_item">
                                    <i className="lnr lnr-envelope"></i>
                                    <h6>
                                        <a href={emptyHrefLink}>charitydiscount@gmail.com</a>
                                    </h6>
                                    <p>
                                        <FormattedMessage id="contact.mail.label"
                                                          defaultMessage="Send us your message anytime!"/>
                                    </p>
                                </div>
                                <div className="info_item">
                                    <i className="fa fa-facebook"></i>
                                    <h6>
                                        <a href={emptyHrefLink}>Charity Discount Facebook</a>
                                    </h6>
                                </div>
                                <br/>
                                <div className="info_item">
                                    <i className="fa fa-instagram"></i>
                                    <h6>
                                        <a href={emptyHrefLink}>Charity Discount Instagram</a>
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="row contact_form">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <GenericInput className={"form-control"}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "contact.name"})
                                                      }
                                                      type={InputType.TEXT} id={"name"}
                                                      handleChange={this.handleNameChange}/>
                                    </div>
                                    <div className="form-group">
                                        <GenericInput className={"form-control"}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "contact.email"})
                                                      }
                                                      type={InputType.TEXT} id={"email"}
                                                      handleChange={this.handleEmailChange}/>
                                    </div>
                                    <div className="form-group">
                                        <GenericInput className={"form-control"}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "contact.subject"})
                                                      }
                                                      type={InputType.TEXT} id={"subject"}
                                                      handleChange={this.handleSubjectChange}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                            <textarea className="form-control"
                                                      id={"message"}
                                                      value={this.state.message}
                                                      onChange={this.handleMessageChange}
                                                      placeholder={
                                                          this.props.intl.formatMessage({id: "contact.message"})
                                                      }>
                                             </textarea>
                                    </div>
                                </div>
                                <div className="col-md-12 text-right">
                                    <button type="submit" value="submit" className="btn submit_btn"
                                            onClick={this.handleSendMessage}>
                                        <FormattedMessage id="contact.send.message.button"
                                                          defaultMessage="Send Message"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


export default injectIntl(Contact);

