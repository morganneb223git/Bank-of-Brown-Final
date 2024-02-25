///Create Account Component ./frontend/src/createaccount.js

import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [variant, setVariant] = React.useState('success'); // For Alert styling

  return (
    <Card className="mt-3 mb-3">
      <Card.Body>
        <Card.Title>Create Account</Card.Title>
        {status && <Alert variant={variant}>{status}</Alert>}
        {show ? 
          <CreateForm setShow={setShow} setStatus={setStatus} setVariant={setVariant} /> : 
          <CreateMsg setShow={setShow} />}
      </Card.Body>
    </Card>
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <Button variant="primary" onClick={() => props.setShow(true)}>Add another account</Button>
    </>
  );
}

function CreateForm(props) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState({}); // State to keep track of form errors

  // Function to validate form fields
  const validateForm = () => {
    let tempErrors = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
    } else if (!email.endsWith('.com')) { // Check if email ends with .com
      tempErrors.email = "Email must end with .com";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  function handle() {
    // Validate form before submitting
    if (!validateForm()) return;

    fetch('/account/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      props.setShow(false);
      props.setStatus('Account successfully created. Please log in.');
      props.setVariant('success');
    })
    .catch(error => {
      console.error('Error:', error);
      props.setStatus('Failed to create account. Please try again.');
      props.setVariant('danger');
    });
  }

  return (
    <Form>
      {/* Name field */}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter name" 
          value={name} 
          isInvalid={!!errors.name} // Show invalid feedback if name error exists
          onChange={e => setName(e.currentTarget.value)} />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Email field */}
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={email} 
          isInvalid={!!errors.email} // Show invalid feedback if email error exists
          onChange={e => setEmail(e.currentTarget.value)} />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Password field */}
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Enter password" 
          value={password} 
          isInvalid={!!errors.password} // Show invalid feedback if password error exists
          onChange={e => setPassword(e.currentTarget.value)} />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" onClick={handle}>Create Account</Button>
    </Form>
  );
}

export default CreateAccount;