/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type Album = {
  __typename?: 'Album';
  artist: Artist;
  createdAt: Scalars['DateTimeISO']['output'];
  name: Scalars['String']['output'];
  numRatings: Scalars['Float']['output'];
  releaseDate: Scalars['DateTimeISO']['output'];
  staticRating: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  userRating: Scalars['Float']['output'];
  userRatingTotal: Scalars['Float']['output'];
  uuid: Scalars['ID']['output'];
};

export type Artist = {
  __typename?: 'Artist';
  albums: Array<Album>;
  createdAt: Scalars['DateTimeISO']['output'];
  endYear?: Maybe<Scalars['Float']['output']>;
  members: Array<Member>;
  name: Scalars['String']['output'];
  startYear: Scalars['Float']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  uuid: Scalars['ID']['output'];
};

export type Member = {
  __typename?: 'Member';
  artists: Array<Artist>;
  createdAt: Scalars['DateTimeISO']['output'];
  fullName: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  uuid: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUserRating: Album;
};


export type MutationUpdateUserRatingArgs = {
  data: UpdateUserRatingInput;
};

export type Query = {
  __typename?: 'Query';
  album?: Maybe<Album>;
  albums: Array<Album>;
  artist?: Maybe<Artist>;
  artists: Array<Artist>;
  member?: Maybe<Member>;
  members: Array<Member>;
};


export type QueryAlbumArgs = {
  id: Scalars['String']['input'];
};


export type QueryArtistArgs = {
  id: Scalars['String']['input'];
};


export type QueryMemberArgs = {
  id: Scalars['String']['input'];
};

/** User rating update parameters */
export type UpdateUserRatingInput = {
  rating: Scalars['Float']['input'];
  uuid: Scalars['String']['input'];
};

export type AlbumsQueryVariables = Exact<{ [key: string]: never; }>;


export type AlbumsQuery = { __typename?: 'Query', albums: Array<{ __typename?: 'Album', name: string, releaseDate: any, uuid: string, staticRating: number, userRating: number, artist: { __typename?: 'Artist', name: string } }> };

export type UpdateAlbumRatingMutationVariables = Exact<{
  data: UpdateUserRatingInput;
}>;


export type UpdateAlbumRatingMutation = { __typename?: 'Mutation', updateUserRating: { __typename?: 'Album', uuid: string, userRating: number } };

export type ArtistsQueryVariables = Exact<{ [key: string]: never; }>;


export type ArtistsQuery = { __typename?: 'Query', artists: Array<{ __typename?: 'Artist', uuid: string, name: string, startYear: number, endYear?: number | null }> };


export const AlbumsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"albums"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"releaseDate"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"staticRating"}},{"kind":"Field","name":{"kind":"Name","value":"userRating"}},{"kind":"Field","name":{"kind":"Name","value":"artist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AlbumsQuery, AlbumsQueryVariables>;
export const UpdateAlbumRatingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAlbumRating"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserRatingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserRating"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"userRating"}}]}}]}}]} as unknown as DocumentNode<UpdateAlbumRatingMutation, UpdateAlbumRatingMutationVariables>;
export const ArtistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"artists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startYear"}},{"kind":"Field","name":{"kind":"Name","value":"endYear"}}]}}]}}]} as unknown as DocumentNode<ArtistsQuery, ArtistsQueryVariables>;