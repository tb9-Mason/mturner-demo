import type { PropsWithChildren } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

export const GqlProvider = ({ children }: PropsWithChildren) => {
  const client = new ApolloClient({
    uri: `${import.meta.env.VITE_API_HOST}/graphql`,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
