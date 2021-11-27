import React, { useState, useEffect } from "react";
import axios from "axios";
// redux
import { useSelector } from "react-redux";
// react router
import { LinkContainer } from "react-router-bootstrap";
// bootstrap
import { Card, Row, Col, Button, Container, Accordion } from "react-bootstrap";

import Header from "./Header.js";

export default function SellerProfile() { 
  // setup redux
  const sellerInfo = useSelector((state) => state.sellerInfo);

  // sold item state
  const [soldItems, setSoldItems] = useState([]);

  useEffect(async() => {
    // const url = process.env.ITEMS_ROUTE || 'http://localhost:8080/items';
    const url = '/items'
    const response = await axios.get(url, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    });
    const items = response.data.filter((item)=> item.seller_id === sellerInfo.id && item.conformation !== null).reverse()
    setSoldItems(items);
  },[]);

  return (
    <>
    <Header userStatus="seller" />
    <Container className="w-50 text-center">
    <Row className="mb-5">
        <h1 className="mb-2">Thank you, {sellerInfo.shop_name}</h1>
        <Col className="d-flex">
          <dl className="w-50 border-right">
            <dt>Food Saved</dt>
            <dd>{soldItems.length} Servings</dd>
          </dl>
          <dl className="w-50">
            <dt>Money Saved</dt>
            <dd>{soldItems.reduce((total, item) => {
              total += item.price;
              return total;
            }, 0)} Yen</dd>
          </dl>
        </Col>
      </Row>
      <Row>
        <Col>
        <Card>
          <Card.Header>
            <strong>{sellerInfo.shop_name}</strong>
          </Card.Header>
          <Card.Body>
            <dl>
              <dt>Address</dt>
              <dd>{sellerInfo.shop_location}</dd>
            </dl>
            <dl>
              <dt>Business hours</dt>
              <dd>
                {sellerInfo.opening_time} - {sellerInfo.closing_time}
              </dd>
            </dl>
            <dl>
              <dt>Phone number</dt>
              <dd>{sellerInfo.phone_number}</dd>
            </dl>
            <LinkContainer to="/seller-form">
              <Button variant="light">Edit profile</Button>
            </LinkContainer>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <h3 className="text-center">Sold Items</h3>
          <Accordion className="cart-accordion" defaultActiveKey="0">
            {soldItems.map((item, index) => {
              return (
                <Accordion.Item eventKey={index} key={index}>
                  <Accordion.Header>{item.name}</Accordion.Header>
                  <Accordion.Body>
                    <dl>
                      <dt>Price</dt>
                      <dd>{item.price} yen</dd>
                    </dl>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
      </Col>
      </Row>
      
    </Container>
    </>
  );
}
