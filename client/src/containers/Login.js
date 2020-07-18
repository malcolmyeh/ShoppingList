import React from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";

export default function Login() {
    const { userHasAuthenticated } = useAppContext();
    const history = useHistory();
    var [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });
    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            console.log(e.message);
        }
    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Label>Email</Form.Label>
                <FormControl
                    autoFocus
                    id="email"
                    type="email"
                    value={fields.email}
                    onChange={handleFieldChange}
                />
                <Form.Label>Password</Form.Label>
                <FormControl
                    id="password"
                    type="password"
                    value={fields.password}
                    onChange={handleFieldChange}
                />
                <Button disabled={!validateForm()} type="submit">
                    Login
                </Button>
            </Form>
        </div>
    )

}