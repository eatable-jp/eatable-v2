import { useForm } from "react-hook-form";
// redux
import { useSelector, useDispatch } from "react-redux";
// react router
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
// bootstrap
import { Container, Form, Button } from "react-bootstrap";
//axios
import axios from "axios";


export default function SellerForm() {
  // setup react form
  const { register, handleSubmit, reset } = useForm();
  // setup redux
  const dispatch = useDispatch();
  const sellerInfo = useSelector((state) => state.sellerInfo);

  // redirect function
  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/seller-profile`; 
    history.push(path);
  }

  const editSellerProfileHandler = async({seller_name, shop_name, shop_location, shop_long,
  shop_lat, opening_time, closing_time, phone_number, email_address}) => {
    const data = {
      id: sellerInfo.id,
      shop_name, 
      shop_location,
      shop_long: sellerInfo.shop_long,
      shop_lat: sellerInfo.shop_lat,
      phone_number,
      opening_time,
      closing_time,

    };
    Object.keys(data).forEach((key) => {
      //check if values passed in
      if (data[key] === "" || data[key] === null) {
        delete data[key];
      }
    });

    // checks if new address and calls api
    if (data.shop_location){
      const key = process.env.REACT_APP_GEO_KEY
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${shop_location}&components=country:JP&key=${key}`;
      const addressData = await axios.post(url)
      data.shop_lat = String(addressData.data.results[0].geometry.location.lat)
      data.shop_long = String(addressData.data.results[0].geometry.location.lng)
    };
    /******************WHY DOES THIS WORK HERE AND NOT AFTER****************** */
    routeChange();
    reset();
    //const url = process.env.SELLER_ROUTE || 'http://localhost:8080/seller'
    const url = '/seller'
    await axios.patch(url, data, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    });
    console.log("reached")
  };

  return (
    <Container className="w-25">
      <h1> Please enter your details </h1>
      <Form onSubmit={handleSubmit(editSellerProfileHandler)}>
        <Form.Group className="mb-3" controlId="formBasicShopName">
          <Form.Label>Shop name</Form.Label>
          <Form.Control
            type="text"
            placeholder={sellerInfo.shop_name}
            {...register("shop_name")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder={sellerInfo.shop_location}
            {...register("shop_location")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            type="text"
            placeholder={sellerInfo.phone_number}
            {...register("phone_number")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicOpeningTime">
          <Form.Label>Opening time</Form.Label>
          <Form.Control
            type="text"
            placeholder={sellerInfo.opening_time}
            {...register("opening_time")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicClosingTime">
          <Form.Label>Closing time</Form.Label>
          <Form.Control
            type="text"
            placeholder={sellerInfo.closing_time}
            {...register("closing_time")}
          />
        </Form.Group>
        <Button className="mr-2" variant="outline-success" type="submit">
          Submit
        </Button>{" "}
        <LinkContainer to="/seller-profile">
          <Button variant="outline-danger" type="submit">
            Cancel
          </Button>
        </LinkContainer>
      </Form>
    </Container>
  );
}
