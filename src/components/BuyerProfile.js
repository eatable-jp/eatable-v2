import React, { useState, useEffect } from "react";
import axios from "axios";
// redux
import { useSelector, useDispatch } from "react-redux";
import { fetchBuyer } from "../slice/buyerInfoSlice";
import { fetchSellers } from "../slice/sellersSlice";
// react router
import { LinkContainer } from "react-router-bootstrap";
// bootstrap
import { Row, Col, Card, Button, Container, Accordion } from "react-bootstrap";
// components
import Header from "./Header.js";

export default function BuyerProfile() {
  // setup redux
  const dispatch = useDispatch();
  const buyerInfo = useSelector((state) => state.buyerInfo);
  const { items } = useSelector((state)=> state.items);
  const sellers = useSelector((state) => state.sellers);
  
  const [purchases, setPurchases] = useState([]);

  useEffect(async () => {
    dispatch(fetchSellers());
    dispatch(fetchBuyer(buyerInfo.id));

    //const url = process.env.ITEMS_ROUTE || 'http://localhost:8080/items';
    const url = '/items'
    const response = await axios.get(url, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    });
    const items = response.data.filter((item)=> item.buyer_id === buyerInfo.id).reverse();
    
    setPurchases(items);

  }, []);

  return (
    <>
    <Header userStatus="buyer" />
    <Container className="w-50 text-center">
    <Row className="mb-5">
    <h1>Thank you, {buyerInfo.buyer_name}</h1>
        <Col className="d-flex">
          <dl className="w-50 border-right">
            <dt>Food Saved</dt>
            <dd>{purchases.length} Servings</dd>
          </dl>
          <dl className="w-50">
            <dt>Money Saved</dt>
            <dd>{purchases.reduce((total, item) => {
              total += (item.original_price - item.price);
              return total;
            }, 0)} Yen</dd>
          </dl>
        </Col>
      </Row>
      <Row>
        {/* buyer profile */}
        <Col className="text-center">
          <Card>
            <Card.Header>
              <strong>{buyerInfo.buyer_name}</strong>
            </Card.Header>
            <Card.Body>
              <dl>
                <dt>Address</dt>
                <dd>{buyerInfo.buyer_address}</dd>
              </dl>
              <dl>
                <dt>Email</dt>
                <dd>{buyerInfo.email_address}</dd>
              </dl>
              <dl>
                <dt>Phone number</dt>
                <dd>{buyerInfo.phone_number}</dd>
              </dl>
              <LinkContainer to="/buyer-form">
                <Button variant="light">Edit profile</Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>
        {/* purchase history */}
        <Col>
          <h3 className="text-center">Your purchase</h3>
          <Accordion className="cart-accordion" defaultActiveKey="0">
            {purchases.map((purchase, index) => {
              return (
                <Accordion.Item eventKey={index} key={index}>
                  <Accordion.Header>{purchase.name}</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex">
                      <dl style={{marginRight: "10px"}}>
                        <dt>Price</dt>
                        <dd>{purchase.price} yen</dd>
                      </dl>
                      <dl>
                        <dt>Original Price</dt>
                        <dd style={{textDecoration: "line-through"}}>{purchase.original_price} yen</dd>
                      </dl>
                    </div>
                    <dl>
                      <dt>Shop address</dt>
                      <dd>
                        {
                          sellers.find((seller) => seller.id === purchase.seller_id)[
                            "shop_location"
                          ]
                        }{" "}
                      </dd>
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
