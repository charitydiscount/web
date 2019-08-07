import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import {emptyHrefLink} from "../../helper/Constants";

class Contact extends React.Component{

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.CONTACT));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.CONTACT));
    }

    public render() {
        return (
            <section className="contact_area p_120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="contact_info">
                                <div className="info_item">
                                    <i className="lnr lnr-home"></i>
                                    <h6>California, United States</h6>
                                    <p>Santa monica bullevard</p>
                                </div>
                                <div className="info_item">
                                    <i className="lnr lnr-phone-handset"></i>
                                    <h6>
                                        <a href={emptyHrefLink}>00 (440) 9865 562</a>
                                    </h6>
                                    <p>Mon to Fri 9am to 6 pm</p>
                                </div>
                                <div className="info_item">
                                    <i className="lnr lnr-envelope"></i>
                                    <h6>
                                        <a href={emptyHrefLink}>support@colorlib.com</a>
                                    </h6>
                                    <p>Send us your query anytime!</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <form className="row contact_form">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter your name"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter email address"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="subject" name="subject" placeholder="Enter Subject"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <textarea className="form-control" name="message" id="message" placeholder="Enter Message"></textarea>
                                    </div>
                                </div>
                                <div className="col-md-12 text-right">
                                    <button type="submit" value="submit" className="btn submit_btn">Send Message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


export default Contact;

