import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormControl, Button, Col, Container } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import config from "../config";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import { useFormFields } from "../libs/hooksLib";
import LoadingButton from "../components/LoadingButton"
export default function NewItem() {
    const file = useRef(null);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        itemName: "",
        quantity: "",
        units: "",
        category: "",
        alternative: [""],
        notes: ""
    });

    function validateForm() {
        return fields.itemName.length > 0 && fields.quantity.length > 0 && fields.units.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
                1000000} MB.`
            );
            return;
        }

        setIsLoading(true);
        var itemName = fields.itemName;
        var quantity = fields.quantity;
        var units = fields.units;
        var alternative = fields.alternative;
        var notes = fields.notes;
        var category = fields.category;
        try {
            const picture = file.current ? await s3Upload(file.current) : null;
            await createItem({ itemName, quantity, units, category, alternative, notes, picture });
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function createItem(item) {
        return API.post("items", "/items", {
            body: item
        });
    }


    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Row>
                    <Col sm="4">
                        <Form.Label>Item</Form.Label>
                        <Form.Control
                            id="itemName"
                            value={fields.itemName}
                            onChange={handleFieldChange}
                        />
                    </Col>
                    <Col sm="1">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            id="quantity"
                            value={fields.quantity}
                            onChange={handleFieldChange}
                        />
                    </Col>
                    <Col sm="1">
                        <Form.Label>Units</Form.Label>
                        <Form.Control
                            id="units"
                            value={fields.units}
                            onChange={handleFieldChange}
                        />
                    </Col>
                    <Col sm="4">
                        <Form.Label>Alternative</Form.Label>
                        <Form.Control
                            id="alternative"
                            value={fields.alternative}
                            onChange={handleFieldChange}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            id="category"
                            value={fields.category}
                            onChange={handleFieldChange}
                        />
                    </Col>
                </Form.Row>

                <Form.Label>Notes</Form.Label>
                <Form.Control
                    id="notes"
                    value={fields.notes}
                    as="textarea"
                    onChange={handleFieldChange}
                />
                <Form.Label>Picture</Form.Label>
                <Form.Control
                    id="file"
                    onChange={handleFileChange}
                    type="file"
                />
                <LoadingButton
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                > Add </LoadingButton>
            </Form>
        </Container>
    )
}

