import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
// redux
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../slice/itemsSlice";
// bootstrap
import { Row, Col, Card, Button, Form, Modal } from "react-bootstrap";

export default function ListedItems() {
  // setup redux
  const dispatch = useDispatch();
  const sellerInfo = useSelector((state) => state.sellerInfo);
  const { items } = useSelector((state) => state.items);

  // setup react form
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchItems());
  }, []);

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

  // function to display add new item modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // filtering items that matches logged in seller
  const itemList = items.filter((item) => item.seller_id === sellerInfo.id).reverse();

  const deleteHandler = async(data) => {
    console.log("delete", data);
    //const url = process.env.ITEM_ROUTE || 'http://localhost:8080/item';
    const url = '/item'
    await axios.delete(url+`?id=${data}`, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    })
  };

  const editItemHandler = async ({name, image, type, price, original_price, expiration_date, note}) => {
    handleClose();
    let data = {
      id: selectedItem.id,
      name,
      image: image.length !== 0 ? await base64(image[0]) : "",
      type,
      price,
      original_price,
      expiration_date,
      note,
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === "" || data[key] === null) {
        delete data[key];
      }      
    });
    if (data.price) {
      data.price = parseInt(data.price);
    }
    if (data.original_price) {
      data.original_price = parseInt(data.original_price);
    }
    // const url = process.env.ITEM_ROUTE || 'http://localhost:8080/item'
    const url = '/item'
    await axios.patch(url, data, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    })
    reset();
  };
  
  // Converts image into base 64
  const base64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const handleDelete = (id) => {
    deleteHandler(id);
    dispatch(fetchItems());
    handleClose();   
  }

  return (
    <>
      <Row xs={1} md={2} className="g-4">
        {itemList.map((item, index) => {
          return (
            <Col key={index}>
              <Card bg="Light" className="h-100" key={index}>
                {/*<Card.Img variant="top" src={item.image} />*/}
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <figure className="text-center">
                    <img src={item.image} className="seller-item-img" />
                  </figure>
                  <Card.Text>{sellerInfo.shop_name}</Card.Text>
                  <Card.Text>Best before {item.expiration_date}</Card.Text>
                  <Card.Text>{item.note}</Card.Text>
                  <Card.Text className="item-info-current-price">
                    {item.price} yen
                  </Card.Text>
                  <Button
                    variant="light"
                    onClick={() => {
                      handleShow();
                      passSelectedItem(item);
                    }}
                  >
                    Edit item
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      {/* add new item modal */}
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(editItemHandler)}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder={selectedItem.name} {...register("name")}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicType">
                <Form.Label>Type</Form.Label>
                <Form.Select aria-label="type" {...register("type")}>
                  <option value="">Select food type</option>
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
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" {...register("price")} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Original price</Form.Label>
                <Form.Control
                  type="text"
                  {...register("original_price")}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Expiration date</Form.Label>
                <Form.Control type="date" {...register("expiration_date")}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Note</Form.Label>
                <Form.Control type="text" placeholder={selectedItem.note} {...register("note")}/>
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" {...register("image")}/>
              </Form.Group>
              <Button type="submit" variant="outline-success">Submit</Button>{" "}
              <Button type="button" variant="outline-danger" onClick={() => {
                handleDelete(selectedItem.id)
              }}>Delete</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    </>
  );
}
