import * as React from "react";
import {store} from "../../index";
import {NavigationsAction} from "../../redux/actions/NavigationsAction";
import {Stages} from "../helper/Stages";
import GenericInput from "../input/GenericInput";
import {doRegisterAction} from "./UserActions";
import {connect} from "react-redux";

interface IRegisterFormState {
    username: string,
    password: string,
    name: string
}

interface IRegisterFormProps {
    signUp: any,
    status: number | undefined,
}

class Register extends React.Component<IRegisterFormProps, IRegisterFormState> {

    constructor(props: IRegisterFormProps) {
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
        this.props.signUp(this.state.username, this.state.password);
    }

    public componentDidMount() {
        store.dispatch(NavigationsAction.setStageAction(Stages.REGISTER));
    }

    public componentWillUnmount() {
        store.dispatch(NavigationsAction.resetStageAction(Stages.REGISTER));
    }

    public render() {
        return (
            <section className="login_box_area p_120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="login_box_img">
                                <img className="img-fluid" src="img/login.jpg" alt=""/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="login_form_inner reg_form">
                                <h3>Create an Account</h3>
                                <form className="row login_form">
                                    <div className="col-md-12 form-group">
                                        <GenericInput type={"text"} id={'name'} placeholder={"Name"}
                                                      className={"form-control"} handleChange={this.handleChange}/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <GenericInput type={"text"} id={'username'} placeholder={"Email Address"}
                                                      className={"form-control"} handleChange={this.handleChange}/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <GenericInput type={"text"} id={'password'} placeholder={"Password"}
                                                      className={"form-control"} handleChange={this.handleChange}/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <GenericInput type={"text"} id={'password'} placeholder={"Confirm password"}
                                                      className={"form-control"} handleChange={this.handleChange}/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <button type="submit" value="submit" className="btn submit_btn"
                                                onClick={this.handleSubmit}>
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        signUp: (user: string, pass: string) => dispatch(doRegisterAction(user, pass))
    };
};

export default connect(null, mapDispatchToProps)(Register);

