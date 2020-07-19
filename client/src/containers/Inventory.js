import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { ListGroup, ListGroupItem, ButtonGroup, Row, Col } from "react-bootstrap";
import { API } from "aws-amplify";

import LoadingButton from "../components/LoadingButton"
export default function Inventory() {
    const [items, setItems] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }
            try {
                const items = await loadItems();
                setItems(items);
            } catch (e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]) // run hook when isAuthenticated is updated

    function deleteItem(itemId) {
        return API.del("items", `/inventory/${itemId}`);
    }

    async function handleDelete(event) {
        event.preventDefault();
        const confirmed = window.confirm(
            "Remove this item from inventory?"
        );
        if (!confirmed) { return; }
        setIsDeleting(true);
        try {
            await deleteItem(event.target.id);
            setItems(await loadItems());
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    async function loadItems() {
        return API.get("items", "/inventory");
    }
    function renderItemsList(items) {
        return (items).map((item, i) =>
            (
                <ListGroupItem key={i}>
                    <Row>
                        <Col xs={6}>
                            <p>{item.itemName} - {item.quantity} {item.units}</p>
                        </Col>
                        <Col>
                            <ButtonGroup>
                                <LoadingButton
                                    variant="outline-dark"
                                    id={item.itemId}
                                    type="submit"
                                    onClick={handleDelete}
                                    isLoading={isDeleting}>
                                    ✕
                                </LoadingButton>

                            </ButtonGroup>
                        </Col>
                    </Row>
                </ListGroupItem>
            ));
    }

    function renderLander() {
        return (
            <div>
                <h1>Inventory</h1>
                <p>Log in to get started!</p>
            </div>
        )
    }

    function renderItems() {
        return (
            <div>
                <h1>Inventory</h1>
                <ListGroup>
                    {!isLoading && renderItemsList(items)}
                </ListGroup>
            </div>
        )
    }
    return (
        <div>
            {isAuthenticated ? renderItems() : renderLander()}
        </div>
    );
}