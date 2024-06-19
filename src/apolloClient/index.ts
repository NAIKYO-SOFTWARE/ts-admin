// apolloClient.js
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { auth } from '../helper-plugin'

const httpLink = new HttpLink({
  uri: import.meta.env.BASE_URL
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'invalid-jwt':
          auth.clearToken()
          auth.clearUserInfo()
          window.location.href = '/auth/login'
          break
        default:
          console.log(`[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`)
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
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
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache()
})

export default client
