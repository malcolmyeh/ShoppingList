// import React, { useState } from "react";
// import { API } from "aws-amplify";
// import { ListGroup, ListGroupItem, Button, ButtonGroup, Modal, Row, Col, Form } from "react-bootstrap";
// import { onError } from "../libs/errorLib";
// import LoadingButton from "../components/LoadingButton";

// import config from "../config";

// export default function InventoryModal(props) {
//     console.log(props.id);
//     async function handleSubmit(event) {
//         event.preventDefault();

//         var itemName = props.itemName;
//         var quantity = props.item.quantity;
//         var units = props.item.units;
//         var category = props.item.category;
//         console.log({ itemName, quantity, units, category });
//         props.setIsLoading(true);
//         try {
//             await createInventoryItem({ itemName, quantity, units, category });
//             props.setIsLoading(false);
//         } catch (e) {
//             onError(e);
//             props.setIsLoading(false);
//         }
//         await props.handleModalClose();
//     }
//     function createInventoryItem(item) {
//         return API.post("items", "/inventory", {
//             body: item
//         });
//     }
//     return (
//         <Modal show={props.showModal} onHide={props.handleModalClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Buy {props.item.itemName}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form.Label>Item</Form.Label>
//                 <Form.Control
//                     as="select"
//                     value={props.itemName}
//                     onChange={props.handleItemNameChange}>
//                     <option>{props.item.itemName}</option>
//                     <option>{props.item.alternative}</option>
//                 </Form.Control>
//             </Modal.Body>
//             <Modal.Footer>
//                 <LoadingButton variant="secondary" isLoading={props.isLoading}
//                     onClick={props.handleModalClose}>
//                     Close
//                 </LoadingButton>
//                 <LoadingButton variant="primary" isLoading={props.isLoading}
//                     onClick={handleSubmit}>
//                     Buy
//                 </LoadingButton>
//             </Modal.Footer>
//         </Modal>
//     )
// }