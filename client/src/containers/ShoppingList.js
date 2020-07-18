import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { ListGroup, ListGroupItem, Button, ButtonGroup, Modal, Row, Col, Form, FormCheck } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import config from "../config";
import InventoryModal from "../components/InventoryModal"
import LoadingButton from "../components/LoadingButton"
export default function ShoppingList() {
    const [items, setItems] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    function getAlternative(item) {
        return {
            itemName: item.alternative,
            alternative: item.itemName,
            quantity: item.quantity,
            units: item.units,
            category: item.category,
            itemId: item.itemId
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("event.target.value: ", event.target.value);
        var item = JSON.parse(event.target.value);
        console.log("item: ", item);
        var itemName = item.itemName;
        var quantity = item.quantity;
        var units = item.units;
        var category = item.category;
        console.log({ itemName, quantity, units, category });
        setIsLoading(true);
        try {
            await createInventoryItem({ itemName, quantity, units, category });
            setIsLoading(false);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
        setIsDeleting(true);
        try {
            await deleteItem(item.itemId);
            setItems(await loadItems());
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }
    function createInventoryItem(item) {
        return API.post("items", "/inventory", {
            body: item
        });
    }

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
        return API.del("items", `/items/${itemId}`);
    }

    async function handleDelete(event) {
        event.preventDefault();
        const confirmed = window.confirm(
            "Remove this item from shopping list?"
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
        return API.get("items", "/items");
    }
    function renderItemsList(items) {
        // always display + add new item at beginning of list
        return [{}].concat(items).map((item, i) =>
            i !== 0 ? (
                <ListGroupItem key={i}>
                    <Row>
                        <Col xs={6}>
                            <LinkContainer key={item.itemId} to={`/items/${item.itemId}`}>
                                <>
                                    <p>{item.itemName} - {item.quantity} {item.units}</p>
                                    <p>alt: {item.alternative}</p>
                                </>
                            </LinkContainer>
                        </Col>
                        <Col>
                            <ButtonGroup>
                                <Button
                                    variant="outline-dark"
                                    id={item.itemId + "buy"}
                                    value={JSON.stringify(item)}
                                    type="submit"
                                    onClick={handleSubmit}>
                                    buy
                                </Button>
                                <Button
                                    variant="outline-dark"
                                    id={item.itemId + "buy_alt"}
                                    value={JSON.stringify(getAlternative(item))}
                                    type="submit"
                                    onClick={handleSubmit}>
                                    alt
                                </Button>
                                <Button
                                    variant="outline-dark"
                                    id={item.itemId}
                                    type="submit"
                                    onClick={handleDelete}
                                    isLoading={isDeleting}>
                                    ✕
                                </Button>

                            </ButtonGroup>
                        </Col>
                    </Row>
                </ListGroupItem>
            ) :
                <LinkContainer key="new" to="items/new">
                    <ListGroupItem>
                        + Add new item
                    </ListGroupItem>
                </LinkContainer>
        );
    }

    function renderLander() {
        return (
            <div>
                <h1>Shopping List</h1>
                <p>Log in to get started!</p>
            </div>
        )
    }

    function renderItems() {
        return (
            <div>
                <h1>Shopping List</h1>
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