import { useForm } from "react-hook-form";
import axios from "axios";
// redux
import { useSelector, useDispatch } from "react-redux";
// react router
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
// bootstrap
import { Container, Form, Button } from "react-bootstrap";
//


export default function BuyerForm() {
  // setup react form
  const { register, handleSubmit, reset } = useForm();
  // setup redux
  const dispatch = useDispatch();
  const buyerInfo = useSelector((state) => state.buyerInfo);
  const buyerId = useSelector((state) => state.buyerInfo.id);

  // redirect function
  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/buyer-profile`; 
    history.push(path);
  }

  const editBuyerProfileHandler = async({buyer_name, buyer_address, phone_number}) => {
    const data = {
      id: buyerId,
      buyer_name, 
      buyer_address,  
      phone_number
    };
    Object.keys(data).forEach((key) => {
      if (data[key] === "" || data[key] === null) {
        delete data[key];
      }
    });
    //const url = process.env.BUYER_ROUTE || 'http://localhost:8080/buyer'
    const url = '/buyer'
    await axios.patch(url, data, {
      headers: JSON.parse(localStorage.getItem("eatable")),
    });
    reset();
    routeChange();
  };

  return (
    <>
    
    <Container className="w-25">
    <h1 className='text-center'> Please Enter your details </h1>
      <Form onSubmit={handleSubmit(editBuyerProfileHandler)}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder={buyerInfo.buyer_name}
            {...register("buyer_name")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder={buyerInfo.buyer_address}
            {...register("buyer_address",{required:true})}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            type="text"
            placeholder={buyerInfo.phone_number}
            {...register("phone_number")}
          />
        </Form.Group>
        <Button className="mr-2" variant="outline-success" type="submit">
          Submit
        </Button>{" "}
        <LinkContainer to="/buyer-profile">
          <Button variant="outline-danger" type="submit">
            Cancel
          </Button>
        </LinkContainer>
      </Form>
    </Container>
    </>
  );
}
