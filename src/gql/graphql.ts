/* eslint-disable */
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
  releaseDate: Scalars['DateTimeISO']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
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

export type Query = {
  __typename?: 'Query';
  album?: Maybe<Album>;
  albums?: Maybe<Array<Album>>;
  artist?: Maybe<Artist>;
  artists: Array<Artist>;
  member?: Maybe<Member>;
  members?: Maybe<Array<Member>>;
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
