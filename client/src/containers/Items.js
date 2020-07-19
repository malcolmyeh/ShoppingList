import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";
import { Form, FormControl, Button, ButtonGroup } from "react-bootstrap";
import config from '../config';
import { s3Upload } from "../libs/awsLib";

export default function Items() {
    const file = useRef(null);
    const { id } = useParams();
    const history = useHistory();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [fields, handleFieldChange] = useFormFields({
        itemName: "",
        quantity: "",
        units: "",
        alternative: "",
        notes: "",
    });

    useEffect(() => {
        function loadItem() {
            return API.get("items", `/items/${id}`);
        }
        async function onLoad() {
            try {
                const item = await loadItem();
                const { itemName, quantity, units, alternative, notes, picture } = item;
                if (picture) {
                    item.pictureUrl = await Storage.vault.get(picture);
                }
                fields.itemName = itemName;
                fields.quantity = quantity;
                fields.units = units;
                fields.alternative = alternative;
                fields.notes = notes;
                setItem(item);
            } catch (e) {
                onError(e);
            }
        }
        onLoad();
    }, [id]);

    function saveItem(item) {
        return API.put("items", `items/${id}`, {
            body: item
        });
    }
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
        try {
            const picture = file.current ? await s3Upload(file.current) : null;
            await saveItem({ itemName, quantity, units, alternative, notes, picture });
            setIsEditing(false);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }

    }

    function deleteItem() {
        return API.del("items", `/items/${id}`);
    }

    async function handleDelete(event) {
        event.preventDefault();
        const confirmed = window.confirm(
            "Remove this item from shopping list?"
        );
        if (!confirmed) { return; }
        setIsDeleting(true);
        try {
            await deleteItem();
            history.push("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }
    return (
        <div>
            {item && (isEditing ? <Form onSubmit={handleSubmit}>
                <h1>{fields.itemName}</h1>
                <Form.Label>Quantity</Form.Label>
                <FormControl
                    id="quantity"
                    value={fields.quantity}
                    onChange={handleFieldChange}
                />
                <Form.Label>Units</Form.Label>
                <FormControl
                    id="units"
                    value={fields.units}
                    onChange={handleFieldChange}
                />
                <Form.Label>alternative</Form.Label>
                <FormControl
                    id="alternative"
                    value={fields.alternative}
                    onChange={handleFieldChange}
                />
                <Form.Label>Notes</Form.Label>
                <FormControl
                    id="notes"
                    value={fields.notes}
                    componentClass="textarea"
                    onChange={handleFieldChange}
                />
                <Form.Label>Picture</Form.Label>
                <FormControl
                    id="file"
                    onChange={handleFileChange}
                    type="file"
                />
                <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                > Update </Button>
                <p>* Update under construction.d</p>
            </Form> :
                <div>
                    <h1>{fields.itemName}</h1>
                    <p>Amount: {fields.quantity} {fields.units}
                        <br />Alternative: {fields.alternative}
                        <br />{fields.notes}</p>

                    <img alt={fields.itemName} src={item.pictureUrl} width={150} height={150} />
                    <br />
                    <ButtonGroup>
                        <Button
                            variant="outline-dark"
                            type="submit"
                            onClick={() => setIsEditing(true)}
                        > Edit
                    </Button>
                        <Button
                            variant="outline-dark"
                            type="submit"
                            onClick={handleDelete}
                            isLoading={isDeleting}>
                            Delete
                    </Button>
                    </ButtonGroup>
                </div>
            )}
        </div>
    );
}