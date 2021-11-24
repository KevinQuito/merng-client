import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useNavigate } from "react-router-dom"; // in react-router v6, you need to use navigate instead of props.history.push

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Login() {
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    // initial state
    username: "",
    password: "",
  });

  // below will use array destructuring
  // we need to trigger the addUser when we submit our form
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // the function update will be triggered if the mutation is successfully executed
    // also we don't need to use proxy, so we'll just use _ instead
    // also it doesn't make sense to call it login, so from result we can destructure data/login/userData. useData is an alias
    update(_, { data: { login: userData}}) {
      // we need to pass it result.data.login so it actually uses the user's data and saves the likes/comments and redirects the menu bar from login to home
      // we need to get that context in order to do the above statement
      context.login(userData);
      // after the registered user was successful, we'll need to redirect the user to the homepage
      // props.history.push('/') the code to the left will not work, use the code below instead
      navigate("/");
    },
    // after the update, we need to handle the errors
    onError(err) {
      // inside of graphQLErrors we get one error back, but inside of that are all the errors that it holds, so we'll access the first error in the array with [0]
      // for some reason err.graphQLErrors[0].extensions.exceptions.errors does not work, but err.graphQLErrors[0].extensions.errors does
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
    // {
    // username: values.username
    // password: values.password
    // email: values.email
    // confirmPassword: values.confirmPassword
    // }
    // the above is the same as the below since the object of values is the same we can just say values
  });
  // const onSubmit = (event) => {
  function loginUserCallback() {
    loginUser();
  }

  return (
    // Form is too wide so we'll make it have a wrapping div container and edit it at our App.css
    <div className="form-container">
      {/* we'll say noValidate because HTML5 by default tries to validate fields */}
      {/* we need to show the loading circle once the user hits the submit button; hence, className={loading ? "loading: ""} */}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        {/* primary will make the button blue */}
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {/* we need to show the errors in our markup */}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          {/* loop through our errors */}
          <ul className="list">
            {/* we get a 'key' that says "username", then we get an error that says "username must not be empty" but we don't need the 'key', 
                    we just need to show the error, so we do Object.values so we access the values and not the keys */}
            {Object.values(errors).map((value) => (
              // we need to give it a key since we're in react, we'll use "value" since that's unique, which contains >{value}</li>
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    # this will trigger a register mutation, which will take a registerInput, which has the same thing in the server side, but we just need to copy it
    login(username: $username, password: $password) {
      # after the above is triggered, we need to get a couple of fields back
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
