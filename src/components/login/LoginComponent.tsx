import * as React from "react";
import GenericInput from "../input/GenericInput";
import {connect} from "react-redux";
import {doLoginAction, doRegisterAction} from "./UserActions";
import {InputType} from "../../helper/Constants";
import ClientsLogo from "../clients/ClientsLogo";


interface ILoginFormState {
    username: string,
    password: string,
    name: string
}

interface ILoginFormProps {
    isLogin: boolean,
    login: any,
    signUp: any
}

class LoginComponent extends React.Component<ILoginFormProps, ILoginFormState> {

    constructor(props: ILoginFormProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleChange(event: any) {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value
        })
    }

    public handleSubmit(event: any) {
        event.preventDefault();
        if(this.props.isLogin) {
            this.props.login(this.state.username, this.state.password);
        }else{
            this.props.signUp(this.state.username, this.state.password, this.state.name);
        }
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
                                    {this.props.isLogin ?
                                        <h3>Log in to enter</h3>
                                        :
                                        <h3>Create an Account</h3>
                                    }
                                    <form className="row login_form">
                                        {!this.props.isLogin ?
                                            <div className="col-md-12 form-group">
                                                <GenericInput type={InputType.TEXT} id={'name'} placeholder={"Name"}
                                                              className={"form-control"}
                                                              handleChange={this.handleChange}/>
                                            </div>
                                            : ""
                                        }
                                        <div className="col-md-12 form-group">
                                            <GenericInput type={InputType.TEXT} id={'username'} placeholder={"Username"}
                                                          className={"form-control"} handleChange={this.handleChange}/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <GenericInput type={InputType.PASSWORD} id={'password'}
                                                          placeholder={"Password"}
                                                          className={"form-control"} handleChange={this.handleChange}/>
                                        </div>
                                        {!this.props.isLogin ?
                                            <div className="col-md-12 form-group">
                                                <GenericInput type={InputType.PASSWORD} id={'password'}
                                                              placeholder={"Confirm password"}
                                                              className={"form-control"}
                                                              handleChange={this.handleChange}/>
                                            </div>
                                            : ""
                                        }
                                        {this.props.isLogin ?
                                            <div className="col-md-12 form-group">
                                                <div className="creat_account">
                                                    <input type="checkbox" id="f-option2" name="selector"/>
                                                    <label>
                                                        Keep me logged in
                                                    </label>
                                                </div>
                                            </div>
                                            : ""
                                        }
                                        {this.props.isLogin ?
                                            <div className="col-md-12 form-group">
                                                <button type="submit" value="submit" className="btn submit_btn"
                                                        onClick={this.handleSubmit}>
                                                    Log In
                                                </button>
                                                <a href="#">Forgot Password?</a>
                                                <a href="/register">Register</a>
                                            </div>
                                            :
                                            <div className="col-md-12 form-group">
                                                <button type="submit" value="submit" className="btn submit_btn"
                                                        onClick={this.handleSubmit}>
                                                    Register
                                                </button>
                                                <a href="/=">Login</a>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ClientsLogo/>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        login: (user: string, pass: string) => dispatch(doLoginAction(user, pass)),
        signUp: (user: string, pass: string, name: string) => dispatch(doRegisterAction(user, pass, name))
    };
};

export default connect(null, mapDispatchToProps)(LoginComponent);


