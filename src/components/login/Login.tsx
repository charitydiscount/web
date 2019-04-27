import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import ClientsLogo from "../clients/ClientsLogo";

class Login extends React.Component {

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.EMPTY));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.EMPTY));
    }

    public render() {
        return (
            <React.Fragment>
                <section className="login_box_area p_120">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="login_box_img">
                                    <img className="img-fluid" src="img/login.jpg" alt=""/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="login_form_inner">
                                    <h3>Log in to enter</h3>
                                    <form className="row login_form">
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control" id="name" name="name"
                                                   placeholder="Username"/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control" id="name" name="name"
                                                   placeholder="Password"/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <div className="creat_account">
                                                <input type="checkbox" id="f-option2" name="selector"/>
                                                <label>
                                                    Keep me logged in
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <button type="submit" value="submit" className="btn submit_btn">Log In
                                            </button>
                                            <br/>
                                            <button type="submit" value="submit" className="btn submit_btn">Register
                                            </button>
                                            <a href="#">Forgot Password?</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*<ClientsLogo/>*/}
            </React.Fragment>
        )
    }
}

export default Login;