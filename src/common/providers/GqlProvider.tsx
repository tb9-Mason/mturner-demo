import { useContext, type PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client';
import { getClientFor } from '../utilities';
import { BackendContext } from './BackendProvider';

export const GqlProvider = ({ children }: PropsWithChildren) => {
  const { backend } = useContext(BackendContext);
  return (
    <ApolloProvider client={getClientFor(backend)} key={backend}>
      {children}
    </ApolloProvider>
  );
};
