import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormControl } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { Auth } from "aws-amplify";
import LoadingButton from "../components/LoadingButton"
export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });
    const history = useHistory();
    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);

            userHasAuthenticated(true);
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Label>Confirmation Code</Form.Label>
                <FormControl
                    id="confirmationCode"
                    autoFocus
                    type="tel"
                    onChange={handleFieldChange}
                    value={fields.confirmationCode}
                />
                <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoadingButton>
            </Form>
        )
    }
    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Label>Email</Form.Label>
                <FormControl
                    id="email"
                    autoFocus
                    type="email"
                    onChange={handleFieldChange}
                    value={fields.email}
                />
                <Form.Label>Password</Form.Label>
                <FormControl
                    id="password"
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.password}
                />
                <Form.Label>Confirm Password</Form.Label>
                <FormControl
                    id="confirmPassword"
                    type="password"
                    onChange={handleFieldChange}
                    value={fields.confirmPassword}
                />
                <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    disabled={!validateForm()}
                >
                    Signup
                </LoadingButton>

            </Form>
        )
    }
    return (
        <div>
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    )
}