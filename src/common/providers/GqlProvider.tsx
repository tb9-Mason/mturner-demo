import type { PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client';
import { gqlClient } from '../utilities';

export const GqlProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={gqlClient}>{children}</ApolloProvider>;
};
