import { ApolloClient, createQueryPreloader, InMemoryCache } from '@apollo/client';

export const gqlClient = new ApolloClient({
  uri: `${import.meta.env.VITE_API_HOST}/graphql`,
  cache: new InMemoryCache(),
});

export const preloadQuery = createQueryPreloader(gqlClient);
