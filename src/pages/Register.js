import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useNavigate } from "react-router-dom"; // in react-router v6, you need to use navigate instead of props.history.push

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Register() {
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  // const [values, setValues] = useState({
  //     username: "",
  //     password: "",
  //     confirmPassword: "",
  //     email: ""
  // })
  // SINCE WE'RE USING USEFORM, we can just remove onChange and onSubmit from this file, it's being used in /util/hooks.js instead and we're calling it from there
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  // onChange will take an event and set the values, we need to spread the values; otherwise, it'll override it with one key value attribute and pair
  // const onChange = (event) => {
  //     setValues({ ...values, [event.target.name]: event.target.value});
  // }
  // the code above will use a custom hook instead from our util/hooks.js

  // below will use array destructuring
  // we need to trigger the addUser when we submit our form
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // the function update will be triggered if the mutation is successfully executed
    // also we don't need to use proxy, so we'll just use _ instead
    // also it doesn't make sense to call it register, so from result we can destructure data/login/userData. useData is an alias
    update(_, { data: { register: userData } }) {
      // we need to pass it result.data.login so it actually uses the user's data and saves the likes/comments and redirects the menu bar from login to home
      // we need to get that context in order to do the above statement
      // we don't need to have two different functions context.login and context.register since they're going to be doing the same thing, which is
      // logging in the user after the userData has been submitted, so we'll just use context.login
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
  //     event.preventDefault();
  //     // here we would usually check, but since our server side is already checking for validation, we don't need to do it again on the client side
  //     // we would need to send a mutation to our server and persist these users if the data is valid
  //     addUser();
  // };

  // this function will call the addUser() that we get from const [addUser, ...] above
  function registerUser() {
    addUser();
  }

  return (
    // Form is too wide so we'll make it have a wrapping div container and edit it at our App.css
    <div className="form-container">
      {/* we'll say noValidate because HTML5 by default tries to validate fields */}
      {/* we need to show the loading circle once the user hits the submit button; hence, className={loading ? "loading: ""} */}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        {/* primarys will make the button blue */}
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    # this will trigger a register mutation, which will take a registerInput, which has the same thing in the server side, but we just need to copy it
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      # after the above is triggered, we need to get a couple of fields back
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
