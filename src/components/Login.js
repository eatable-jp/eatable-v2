import React, { useRef, useState, useEffect } from "react"
import { Container,Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { Link, useHistory } from "react-router-dom"

import {loginFail, loginPending, loginSuccess} from '../slice/loginSlice'

import {setUser} from '../slice/userSlice'





export default function Login() {

    const dispatch = useDispatch();

    const {isLoadiing, isAuth, error} = useSelector( state => state.login)

    const [soldItems, setSoldItems] = useState([])

  // access DB to make stats
  useEffect(async() => {
    //const url = process.env.ITEMS_ROUTE || 'http://localhost:8080/global';
    const url = '/global'
    const response = await axios.get(url);
    const items = response.data.filter((item)=> item.conformation !== null);
    setSoldItems(items);
  },[]);
  const emailRef = useRef()
  const passwordRef = useRef()

 
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    dispatch(loginPending())

    try {
        
        let user = {
            email: emailRef.current.value,
            password: passwordRef.current.value
          }
        // console.log(user)
        // const url = process.env.LOGIN_ROUTE || 'http://localhost:8080/login'
        const url = '/login'
  
        const res = await axios.post(url, user)
        console.log(res)

        if(res.data.status === "fail") {
          dispatch(loginFail(res.data.message))
        } else {
          dispatch(loginSuccess())
          console.log("success")

          dispatch(setUser(res.data.id))

          console.log(res.data)
          
          console.log(res.data.accessJWT)

          if (res.data.status === "success"){
            localStorage.setItem("eatable", JSON.stringify({accessJWT: res.data.accessJWT }));
          }

          if (res.data.type === "1") {
             const id = res.data.id;
             //const url = process.env.SELLER_ROUTE || 'http://localhost:8080/seller';
            const url = '/seller'
            const seller = await axios.get(url+`/${id}`, {
                 headers: JSON.parse(localStorage.getItem("eatable")),
            });
            console.log(seller.data[0])
            if (seller.data[0].shop_name === null || seller.data[0].opening_time === null || seller.data[0].shop_location === null) {
                history.push("/seller-signup-form")
            } else {
              history.push("/seller")
            }
            //history.push("/seller")
          }else {
            const id = res.data.id;
            //const url = process.env.Buyer_ROUTE || 'http://localhost:8080/buyer';
            const url = '/buyer'
            const buyer = await axios.get(url+`/${id}`, {
                 headers: JSON.parse(localStorage.getItem("eatable")),
            });
            if (buyer.data[0].buyer_name=== null) {
              history.push("/buyer-signup-form")
          } else {
            history.push("/buyer")
          }
          }
        }
    } catch (error) {
      dispatch(loginFail(error.message))
    }

  }

  return (     
    <div className="lp-wrapper">
    <h1 className="lp-heading text-center">Eatable</h1>
    <Container className="mt-5">
        <Row>
          <Col>
            <p className="global-stats">
              The amount of food saved ... <br />
              <span className="global-stats-servings">{soldItems.length} Servings</span>
            </p>
          </Col>
          <Col>
          <Card >
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mt-4">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password" className="mt-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={isLoadiing} className="mt-4 w-100" type="submit">
              Log In
            </Button>
            {isLoadiing && <Spinner variant="primary" animation="border" /> }
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2 lp-guide-text">
        Need an account? <Link to="/" className="lp-guide-link">Sign Up</Link>
      </div>
          </Col>
        </Row>
    </Container>
    </div>
  )
}