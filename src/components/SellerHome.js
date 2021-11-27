import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { fetchSeller } from "../slice/sellerInfoSlice";
import { fetchItems } from "../slice/itemsSlice";
// bootstrap
import { Container, Button, Modal, Form, Accordion } from "react-bootstrap";
// components
import SellerItems from "./SellerItems";
import SellerInfo from "./SellerInfo";
// axios
import axios from "axios";
import {setUser} from '../slice/userSlice'

function SellerHome() {
  // setup redux
  const dispatch = useDispatch();
  const seller = useSelector((state) => state.sellerInfo);

  let userId = useSelector((state) => state.user.user_id);

  dispatch(setUser(userId))

  const [waiting, setWaiting] = useState([]);

  useEffect(async()=>{
    dispatch(fetchSeller(userId))
    //const url = process.env.ITEMS_ROUTE || 'http://localhost:8080/items';
    const url = '/items'

    //console.log()
    console.log(JSON.parse(localStorage.getItem("eatable")));
    
    const response = await axios.get(url, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    });
    //*************************HARDCODED 3 TO MATCH THE SELLER NUMBER****** */
    const items = response.data.filter((item)=> item.seller_id === userId && item.buyer_id !== null && item.buyer_id !== 0 && item.conformation === null);
    setWaiting(items);
  },[])

  // function to display add new item modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // setup react form
  const { register, handleSubmit, reset } = useForm();

  const newItemHandler = async({name, image, type, price, original_price, expiration_date, note}) => {
    handleClose();
    const data = {
      name,
      image: await base64(image[0]),
      type,
      price:parseInt(price),
      original_price: parseInt(original_price),
      expiration_date,
      seller_id: seller.id,
      note,
      shop_lat: seller.shop_lat,
      shop_long: seller.shop_long
    }
    //const url = process.env.ITEM_ROUTE || 'http://localhost:8080/item'
    const url = '/item'
    await axios.post(url, data, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    })
    //use the endpoint to post this to the DB
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

  const completeTransaction = async(id) => {
    const data = {
      id,
      conformation:1
    };
     //console.log(JSON.parse(localStorage.getItem("eatable")));
    //const url = process.env.ITEM_ROUTE || `http://localhost:8080/item`;
    const url = '/item'
    await axios.patch(url,data, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    });
  };
  
  const newItemButtonHandle = (data) => {
    newItemHandler(data);
    dispatch(fetchItems());
  }

  return (
    <>
      <div className="mb-5">
        <Container className="text-center mb-5">
          <h2>Currently Listed</h2>
          <Button variant="light" onClick={handleShow}>
            Add a new item
          </Button>
        </Container>
        <Container>
          <SellerItems />
        </Container>
      </div>
      <div>
        <Container  className="text-center">
          <h2>Waiting for pickup</h2>
          <Accordion defaultActiveKey="0">
            {waiting.map((item, index) => {
              return (
                <Accordion.Item eventKey={index} key={index}>
                  <Accordion.Header>{item.name}</Accordion.Header>
                  <Accordion.Body>
                    <dl>
                      <dt>Price</dt>
                      <dd>{item.price} yen</dd>
                    </dl>
                    <dl>
                      <dt>Purchased by Person</dt>
                    </dl>
                    <Button type="button" variant="success" onClick={()=>{completeTransaction(item.id)}}>
                      Complete Transaction
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </Container>
      </div>
      {/* add new item modal */}
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add a new item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(newItemButtonHandle)}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" {...register("name")}/>
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
                <Form.Control type="text" placeholder="Enter price" {...register("price")} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Original price</Form.Label>
                <Form.Control type="text" placeholder="Enter original price" {...register("original_price")}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Expiration date</Form.Label>
                <Form.Control type="date" {...register("expiration_date")}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasic">
                <Form.Label>Note</Form.Label>
                <Form.Control type="text" placeholder="Notes" {...register("note")}/>
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" {...register("image")}/>
              </Form.Group>
              <Button type="submit" variant="outline-success">Submit</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    </>
  );
}

export default SellerHome;
