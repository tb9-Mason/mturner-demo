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

export const UPDATE_ALBUM_RATING = gql(`
  mutation UpdateAlbumRating($data: UpdateUserRatingInput!) {
    updateUserRating(data: $data) {
        uuid
        userRating
    }
  }
`);
