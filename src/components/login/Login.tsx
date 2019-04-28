import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import GenericInput from "../input/GenericInput";
import {connect} from "react-redux";
import {doLoginAction, doLogoutAction} from "./UserActions";

interface ILoginFormState {
    username: string,
    password: string
}

interface ILoginFormProps {
    logout: () => void,
    login: any,
    status: number | undefined,
}


class Login extends React.Component<ILoginFormProps, ILoginFormState> {

    constructor(props: ILoginFormProps) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
        this.props.login(this.state.username, this.state.password);
    }

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
                                            <GenericInput type={"text"} id={'username'} placeholder={"Username"}
                                                          className={"form-control"} handleChange={this.handleChange}/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <GenericInput type={"text"} id={'password'} placeholder={"Password"}
                                                          className={"form-control"} handleChange={this.handleChange}/>
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
                                            <button type="submit" value="submit" className="btn submit_btn"
                                                    onClick={this.handleSubmit}>
                                                Log In
                                            </button>
                                            <a href="#">Forgot Password?</a>
                                            <a href="/register">Register</a>
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

const mapDispatchToProps = (dispatch: any) => {
    return {
        login: (user: string, pass: string) => dispatch(doLoginAction(user, pass)),
        logout: () => dispatch(doLogoutAction()),
    };
};

export default connect(null, mapDispatchToProps)(Login);


