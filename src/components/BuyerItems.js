import React, { useState, useEffect } from "react";
// react icons
import { IconContext } from 'react-icons'
import { BiInfoCircle } from 'react-icons/bi'
// redux
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../slice/cartSlice";
import { removeFromCart } from "../slice/cartSlice";
import { fetchItems } from "../slice/itemsSlice";
import { fetchSellers } from "../slice/sellersSlice";
// bootstrap
import { Row, Col, Card, Image, Button, Modal } from "react-bootstrap";

export default function BuyerItems({ distance }) {
  // setup redux
  const dispatch = useDispatch();
  const { filteredItems } = useSelector((state) => state.items);
  const location = useSelector((state) => state.location);
  const cart = useSelector((state) => state.cart);
  const sellers = useSelector((state) => state.sellers);

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchSellers());
  }, [])

  // reversing the items to place the newest item on top
  let reverseFiltered = [...filteredItems];
  reverseFiltered = reverseFiltered.reverse();

  // selectedItem state
  const [selectedItem, setSelectedItem] = useState({
    buyer: "",
    expiration_date: "",
    id: "",
    image: "",
    name: "",
    note: "",
    original_price: "",
    price: "",
    seller_id: "",
    type: "",
  });
  // selectedItem state: function to keep track of selected item
  function passSelectedItem(item) {
    setSelectedItem(item);
  }
  // selectedItem's shop
  const shop =
    selectedItem.seller_id === ""
      ? ""
      : sellers.find((seller) => seller.id === selectedItem.seller_id)[
          "shop_name"
        ];

  // function for calculating distance
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // modal function
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {distance === "" ? (
        // within 2km
        <Row xs={1} md={3} className="g-4">
          {reverseFiltered.map((item, index) => {
            return (
              <Col key={index}>
                <Card className="h-100" key={index}>
                  <Card.Header className="d-flex justify-content-between">
                    <p className="mb-0">{item.name}</p>
                    <p className="mb-0">Price: {item.price}</p>
                  </Card.Header>
                    <figure className="text-center">
                      <img variant="top" src={item.image} className="buyer-item-img"/>
                    </figure>
                  <Card.Body>
                    <Card.Text className="mb-1">
                      Best before {item.expiration_date}
                    </Card.Text>

                    <div className="d-flex justify-content-between">
                      {cart.some((cartItem) => cartItem.id === item.id) ? (
                        <Button
                          variant="danger"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          Remove from cart
                        </Button>
                      ) : (
                        <Button
                          variant="light"
                          onClick={() => dispatch(addToCart(item))}
                        >
                          Add to cart
                        </Button>
                      )}
                      <IconContext.Provider value={{size: "20px"}}>
                        <BiInfoCircle onClick={() => {
                            handleShow();
                            passSelectedItem(item);
                          }} />
                      </IconContext.Provider>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : distance === "2" ? (
        // within 4km
        <Row xs={1} md={3} className="g-4">
          {filteredItems
            .filter(
              (item) =>
                getDistanceFromLatLonInKm(
                  item.shop_lat,
                  item.shop_long,
                  location.latitude,
                  location.longitude
                ) <= 4
            )
            .map((item, index) => {
              return (
                <Col key={index}>
                  <Card className="h-100" key={index}>
                    <Card.Header className="d-flex justify-content-between">
                      <p className="mb-0">{item.name}</p>
                      <p className="mb-0">Price: {item.price}</p>
                    </Card.Header>
                    <figure className="text-center">
                      <img variant="top" src={item.image} className="buyer-item-img"/>
                    </figure>
                    <Card.Body>
                      <Card.Text className="mb-1">
                        Best before {item.expiration_date}
                      </Card.Text>

                      <div className="d-flex justify-content-between">
                        {cart.some((cartItem) => cartItem.id === item.id) ? (
                          <Button
                            variant="danger"
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            Remove from cart
                          </Button>
                        ) : (
                          <Button
                            variant="light"
                            onClick={() => dispatch(addToCart(item))}
                          >
                            Add to cart
                          </Button>
                        )}
                        <IconContext.Provider value={{size: "20px"}}>
                        <BiInfoCircle onClick={() => {
                            handleShow();
                            passSelectedItem(item);
                          }} />
                      </IconContext.Provider>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      ) : distance === "4" ? (
        // within 6km
        <Row xs={1} md={3} className="g-4">
          {filteredItems
            .filter(
              (item) =>
                getDistanceFromLatLonInKm(
                  item.shop_lat,
                  item.shop_long,
                  location.latitude,
                  location.longitude
                ) <= 4
            )
            .map((item, index) => {
              return (
                <Col key={index}>
                  <Card className="h-100" key={index}>
                    <Card.Header className="d-flex justify-content-between">
                      <p className="mb-0">{item.name}</p>
                      <p className="mb-0">Price: {item.price}</p>
                    </Card.Header>
                    <figure className="text-center">
                      <img variant="top" src={item.image} className="buyer-item-img"/>
                    </figure>
                    <Card.Body>
                      <Card.Text className="mb-1">
                        Best before {item.expiration_date}
                      </Card.Text>

                      <div className="d-flex justify-content-between">
                        {cart.some((cartItem) => cartItem.id === item.id) ? (
                          <Button
                            variant="danger"
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            Remove from cart
                          </Button>
                        ) : (
                          <Button
                            variant="light"
                            onClick={() => dispatch(addToCart(item))}
                          >
                            Add to cart
                          </Button>
                        )}
                        <IconContext.Provider value={{size: "20px"}}>
                        <BiInfoCircle onClick={() => {
                            handleShow();
                            passSelectedItem(item);
                          }} />
                      </IconContext.Provider>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      ) : (
        <Row xs={1} md={3} className="g-4">
          {filteredItems
            .filter(
              (item) =>
                getDistanceFromLatLonInKm(
                  item.shop_lat,
                  item.shop_long,
                  location.latitude,
                  location.longitude
                ) <= 7
            )
            .map((item, index) => {
              return (
                <Col key={index}>
                  <Card className="h-100" key={index}>
                    <Card.Header className="d-flex justify-content-between">
                      <p className="mb-0">{item.name}</p>
                      <p className="mb-0">Price: {item.price}</p>
                    </Card.Header>
                    <figure className="text-center">
                      <img variant="top" src={item.image} className="buyer-item-img"/>
                    </figure>
                    <Card.Body>
                      <Card.Text className="mb-1">
                        Best before {item.expiration_date}
                      </Card.Text>

                      <div className="d-flex justify-content-between">
                        {cart.some((cartItem) => cartItem.id === item.id) ? (
                          <Button
                            variant="danger"
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            Remove from cart
                          </Button>
                        ) : (
                          <Button
                            variant="light"
                            onClick={() => dispatch(addToCart(item))}
                          >
                            Add to cart
                          </Button>
                        )}
                        <IconContext.Provider value={{size: "20px"}}>
                        <BiInfoCircle onClick={() => {
                            handleShow();
                            passSelectedItem(item);
                          }} />
                      </IconContext.Provider>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      )}
      {/* modal for full item info */}
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-center">
              <Image src={selectedItem.image} fluid />
            </p>
            <dl>
              <dt>Original price</dt>
              <dd>{selectedItem.original_price} yen</dd>
            </dl>
            <dl>
              <dt>Current price</dt>
              <dd>{selectedItem.price} yen</dd>
            </dl>
            <dl>
              <dt>Shop</dt>
              <dd>{shop}</dd>
            </dl>
            <dl>
              <dt>Distance from you</dt>
              <dd>
                {getDistanceFromLatLonInKm(
                  selectedItem.shop_lat,
                  selectedItem.shop_long,
                  location.latitude,
                  location.longitude
                ).toFixed(1)}
                km
              </dd>
            </dl>
            <dl>
              <dt>Best before</dt>
              <dd>{selectedItem.expiration_date}</dd>
            </dl>
            <dl>
              <dt>Note</dt>
              <dd>{selectedItem.note}</dd>
            </dl>
          </Modal.Body>
          <Modal.Footer>
            {cart.some((cartItem) => cartItem.id === selectedItem.id) ? (
              <Button
                variant="danger"
                onClick={() => {
                  dispatch(removeFromCart(selectedItem.id));
                  handleClose();
                }}
              >
                Remove from cart
              </Button>
            ) : (
              <Button
                variant="light"
                onClick={() => {
                  dispatch(addToCart(selectedItem));
                  handleClose();
                }}
              >
                Add to cart
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}
