import React from 'react';
// here we're going to export an ApolloProvider that wraps the App.js file
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache} from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: 'https://desolate-retreat-98617.herokuapp.com/'
})

// setContext takes in a request and a previous context that we can data from and edit and forward to the next opration, but since we don't need any of those parameters
// we can just omit them
const authLink = setContext(() =>{
    // here we need to get our root token from the local storage
    const token = localStorage.getItem('jwtToken');
    // now that we have it, we need to set it as an authorization header
    return{
        headers: {
            // need to check if we have the token 'cause we might not have it
            // we'll use a template string `` so we can add a variable after Bearer
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})
// we need take authLink that holds the Bearer token and concat it to httpLink, must be before the httpLink
// this should add the token to our request and successfully send any protected API cause
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})


export default (
    <ApolloProvider client = {client}>
        <App />
    </ApolloProvider>
)