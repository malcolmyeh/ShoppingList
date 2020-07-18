import React from "react";
import { Route, Switch } from "react-router-dom";
import ShoppingList from "./containers/ShoppingList";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import NewItem from "./containers/NewItem";
import Items from "./containers/Items.js";
import Inventory from "./containers/Inventory"
export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <ShoppingList />
            </Route>
            <Route exact path="/inventory">
                <Inventory/> 
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route exact path="/items/new">
                <NewItem />
            </Route>
            <Route exact path="/items/:id">
                <Items />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}