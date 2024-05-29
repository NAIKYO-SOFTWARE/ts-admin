// apolloClient.js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { auth } from '../helper-plugin'

const httpLink = new HttpLink({
  uri: 'https://hasura-transfer-services-develop.onrender.com/v1/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = auth.getToken('f-token')
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client
