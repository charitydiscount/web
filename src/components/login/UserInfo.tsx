import GenericInput from "../input/GenericInput";
import {InputType} from "../../helper/Constants";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import * as React from "react";

class UserInfo extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.USER));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.USER));
    }

    public render() {
        return (
            <section className="contact_area p_120">
                <div className="container">
                    <div className="section-top-border">
                        <div className="row">
                            <div className="col-lg-8 col-md-8">
                                <h3 className="mb-30 title_color">User info</h3>
                                <div className="mt-10">
                                    <GenericInput type={InputType.TEXT} id={"name"} placeholder={"Name"}
                                                  className={"single-input"}/>
                                </div>
                                <div className="mt-10">
                                    <GenericInput type={InputType.TEXT} id={"email"} placeholder={"Email"}
                                                  className={"single-input"}/>
                                </div>
                                <div className="mt-10">
                                    <GenericInput type={InputType.PASSWORD} id={"password"} placeholder={"Password"}
                                                  className={"single-input"}/>
                                </div>
                                <div className="mt-10">
                                    <GenericInput type={InputType.PASSWORD} id={"confirmPassword"} placeholder={"ConfirmPassword"}
                                                  className={"single-input"}/>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 mt-sm-30 element-wrap">
                                <div className="single-element-widget">
                                    <h3 className="mb-30 title_color">Donate options</h3>
                                    <div className="switch-wrap d-flex justify-content-between">
                                        <p>Take money</p>
                                        <div className="primary-radio">
                                            <input type="checkbox" id="radio-take-money"/>
                                            <label htmlFor="radio-take-money"></label>
                                        </div>
                                    </div>

                                    <div className="switch-wrap d-flex justify-content-between">
                                        <p>Donate money</p>
                                        <div className="primary-radio">
                                            <input type="checkbox" id="radio-donate-money"/>
                                            <label htmlFor="radio-donate-money"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="col-md-12 text-center">
                            <button type="submit" value="submit" className="btn submit_btn">Update</button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default UserInfo;