// As composition over inheritance is preferred, all inputs will be made containing this structure

import * as React from "react";

// reunion of all types of props input can get
interface IInputProps {
    type: string;

    id: string;
    isRequired ?: boolean;
    handleChange ?: any;
    onKeyUp?: any;
    commentKey?: string;

    groupName?: string;
    value?: string;
    checked?: boolean;

    min?: string;
    max?: string;
    autocomplete?: boolean
    className?: string
    placeholder?: string
    handleChangeBlur?: any;
    handleChangeFocus?: any;
    readonly ?: boolean
    step ?: number
}

const GenericInput = (props: IInputProps) => {
    const autocomplete = props.autocomplete ? "on" : "off";
    return (
        <input id={props.id} type={props.type} required={props.isRequired} onChange={props.handleChange} onKeyUp={props.onKeyUp} onBlur={props.handleChangeBlur}
               onFocus={props.handleChangeFocus} value={props.value} className={props.className} name={props.groupName} min={props.min} max={props.max}
               checked={props.checked} autoComplete={autocomplete} placeholder={props.placeholder} readOnly={props.readonly} step={props.step}/>
    );
};

export default GenericInput;