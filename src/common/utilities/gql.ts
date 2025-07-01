import { ApolloClient, createQueryPreloader, from, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { toast } from 'react-toastify';

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_HOST}/graphql`,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      toast(message, { type: 'error' });
    });
  }
  if (networkError) {
    toast(networkError.message, { type: 'error' });
  }
});

export const gqlClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export const preloadQuery = createQueryPreloader(gqlClient);
