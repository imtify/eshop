import React from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import Meta from "../components/Meta";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation(orderId);

  const payOrderHandler = async () => {
    await payOrder(orderId);
    refetch();
    toast.success("Order is paid");
  };

  const deliverOrderHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success("Order is paid");
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <>
      <Meta title="Order Details" />
      <Row>
        <Col md={8}>
          <ListGroup.Item>
            <h3>Order ID: {order._id}</h3>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.updatedAt.substring(0, 16)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    onClick={payOrderHandler}
                  >
                    Pay Order
                  </Button>
                  {loadingPay && <Loader />}
                </ListGroup.Item>
              )}
              {userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    onClick={deliverOrderHandler}
                  >
                    Delivered Order
                  </Button>
                  {loadingDeliver && <Loader />}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
