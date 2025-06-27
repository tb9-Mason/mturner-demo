import { gql } from '../../../gql';

export const GET_ALBUMS = gql(`
  query Albums {
    albums {
        name
        releaseDate
        uuid
        staticRating
        userRating
        artist {
            name
        }
    }
  }
`);
