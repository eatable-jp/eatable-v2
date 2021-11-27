import React, { useState, useEffect } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { filterByFoodType, filterByExpiration } from "../slice/itemsSlice";
import { setUserLocation } from "../slice/locationSlice";
import { fetchBuyer } from "../slice/buyerInfoSlice";
// bootstrap
import { Container, Form } from "react-bootstrap";
// components
import BuyerItems from "./BuyerItems";

import {setUser} from '../slice/userSlice'

function BuyerHome() {
  // redux
  const buyerInfo = useSelector((state) => state.buyerInfo);

  let userId = useSelector((state) => state.user.user_id);

  

  //const userId = res.locals.user;

  const dispatch = useDispatch();

  dispatch(setUser(userId))
  

  // filter function
  function sendFoodType(type) {
    dispatch(filterByFoodType(type));
  }
  function sendDateFilter(type) {
    dispatch(filterByExpiration(type));
  }

  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setUserLocation({ latitude, longitude }));
      });
    }
    dispatch(fetchBuyer(userId));
  }, []);

  // distance state
  const [distance, setDistance] = useState("");

  return (
    <div className="buyer-wrapper">
      <div className="buyer-items">
        <h2 className="mb-5 text-center">Hello {buyerInfo.buyer_name}!</h2>
        <Container className="d-flex justify-content-start">
          {/* food type filter */}
          <Form
            className="w-25"
            onChange={(e) => sendFoodType(e.target.value)}
            style={{ marginRight: "20px" }}
          >
            <Form.Group className="mb-3" controlId="formBasicType">
              <Form.Label>Food type</Form.Label>
              <Form.Select aria-label="type">
                <option value="all">All</option>
                <option value="Meat">Meat</option>
                <option value="Poultry">Poultry</option>
                <option value="Fish">Fish</option>
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Dairy">Dairy</option>
                <option value="Bread">Bread</option>
                <option value="Canned Food">Canned Food</option>
                <option value="Dry Goods">Dry Goods</option>
                <option value="Ready To Eat">Ready To Eat</option>
              </Form.Select>
            </Form.Group>
          </Form>
          {/* expiration filter */}
          <Form
            className="w-25"
            onChange={(e) => sendDateFilter(e.target.value)}
            style={{ marginRight: "20px" }}
          >
            <Form.Group className="mb-3" controlId="formBasicType">
              <Form.Label>Date</Form.Label>
              <Form.Select aria-label="type">
                <option value="">Select expiration</option>
                <option value="Closest To Expiration">Closest To Expiration</option>
                <option value="Furthest From Expiration">Furthest From Expiration</option>
              </Form.Select>
            </Form.Group>
          </Form>
          {/* location filter */}
          <Form className="w-25" onChange={(e) => setDistance(e.target.value)}>
            <Form.Group className="mb-3" controlId="formBasicLocation">
              <Form.Label>Location</Form.Label>
              <Form.Select aria-label="type">
                <option value="">Select distance</option>
                <option value="2">Within 2km</option>
                <option value="4">Within 4km</option>
                <option value="6">Within 6km</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Container>
        <Container>
          <BuyerItems distance={distance} />
        </Container>
      </div>
    </div>
  );
}

export default BuyerHome;
