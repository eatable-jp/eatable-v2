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
  const { register, handleSubmit, reset, formState:{errors} } = useForm();
  // setup redux
  const buyerId = useSelector((state) => state.buyerInfo.id);
  const userId = useSelector((state) => state.user.user_id);

  // redirect function
  const history = useHistory();
  const routeChange = () =>{ 
    let path = `/buyer`; 
    history.push(path);
  }

  const editBuyerProfileHandler = async({buyer_name, buyer_address, phone_number}) => {
    const data = {
      id: userId,
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
    <h1 className='text-center'>Please complete registration</h1>
      <Form onSubmit={handleSubmit(editBuyerProfileHandler)}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Eatable Taro"
            aria-invalid={errors.buyer_name ? "true" : "false"}
            {...register("buyer_name",{required:true})}
          />
          {errors.buyer_name && errors.buyer_name.type === "required" && (<span role="alert" className="text-danger">This is required</span>)}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Tokyo, Minato City, Motoazabu, 3 Chome−1−35"
            {...register("buyer_address")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. 55-5555-5555"
            {...register("phone_number")}
          />
        </Form.Group>
        <Button className="mr-2" variant="outline-success" type="submit">
          Submit
        </Button>{" "}
        <LinkContainer to="/login">
        <Button variant="outline-danger" type="submit">
            Cancel
          </Button>
        </LinkContainer>
      </Form>
    </Container>
    </>
  );
}
