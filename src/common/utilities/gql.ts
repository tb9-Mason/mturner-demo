import { ApolloClient, createQueryPreloader, from, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { toast } from 'react-toastify';
import { Backend } from '../providers/BackendProvider';

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

const baseLink = from([errorLink, new HttpLink({ uri: `${import.meta.env.VITE_API_HOST}/graphql` })]);
const laravelLink = from([errorLink, new HttpLink({ uri: `${import.meta.env.VITE_API_HOST_LARAVEL}/graphql` })]);

export const getClientFor = (backend: Backend) => {
  return new ApolloClient({ link: backend === 'express' ? baseLink : laravelLink, cache: new InMemoryCache() });
};

export const createPreloadQueryFor = (backend: Backend) => createQueryPreloader(getClientFor(backend));
