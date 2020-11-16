import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Modal, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import {
  listProducts,
  deleteProduct,
  addProduct
} from '../actions/productActions';
import { PRODUCT_ADD_RESET } from '../constants/productConstants';

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete
  } = productDelete;

  const productAdd = useSelector((state) => state.productAdd);
  const {
    loading: loadingAdd,
    error: errorAdd,
    success: successAdd,
    product: addedProduct
  } = productAdd;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_ADD_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successAdd) {
      history.push(`/admin/product/${addedProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successAdd,
    addedProduct,
    pageNumber
  ]);

  const deleteHandler = (id) => {
    dispatch(deleteProduct(id));
    setShow(false);
  };

  const addProductHandler = () => {
    dispatch(addProduct());
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={addProductHandler}>
            <i className='fas fa-plus'></i> Add Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingAdd && <loader />}
      {errorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>MANUFACTURER</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.manufacturer}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={handleShow}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Delete User</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Are you sure want to delete this product?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant='secondary' onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          variant='danger'
                          onClick={() => deleteHandler(product._id)}
                        >
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
