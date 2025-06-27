import { gql } from '../../../gql';

export const GET_ARTISTS = gql(`
  query Artists {
    artists {
      uuid
      name
      startYear
      endYear
    }
  }
`);
