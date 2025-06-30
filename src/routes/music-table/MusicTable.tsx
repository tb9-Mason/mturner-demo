import { useEffect, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { useMutation, useReadQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import { AlbumsQuery } from '../../gql/graphql';
import { dateFormatter } from '../../common/utilities';
import { Heading, Table } from '../../common/components';
import { UPDATE_ALBUM_RATING } from './queries/albums.queries';
import { Rating } from './components';

export const MusicTable = () => {
  // Get the prefetched query from the route loader and set in state
  const { albums: albumsQueryRef } = useLoaderData();
  const { data } = useReadQuery<AlbumsQuery>(albumsQueryRef);
  const [albums, setAlbums] = useState(data.albums);
  const [loadingAlbums, setLoadingAlbums] = useState<Record<string, boolean>>({});

  // TODO: add error logic
  const [updateUserRatingMutation, { data: userRatingData }] = useMutation(UPDATE_ALBUM_RATING);
  const columnHelper = createColumnHelper<AlbumsQuery['albums'][0]>();

  useEffect(() => {
    if (userRatingData) {
      const {
        updateUserRating: { uuid, userRating },
      } = userRatingData;

      setAlbums((prev) => {
        return prev.map((item) => (item.uuid === uuid ? { ...item, userRating } : item));
      });
      setLoadingAlbums((prev) => {
        return { ...prev, [uuid]: false };
      });
    }
  }, [userRatingData]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (ctx) => {
          return (
            <a href={ctx.row.original.link} target="_blank" rel="noreferrer">
              {ctx.getValue()}
            </a>
          );
        },
      }),
      columnHelper.accessor('releaseDate', {
        header: 'Release Date',
        cell: (ctx) => {
          return dateFormatter.format(new Date(ctx.getValue()));
        },
      }),
      columnHelper.accessor('artist.name', { header: 'Artist' }),
      columnHelper.accessor('staticRating', {
        header: "Mason's Rating",
        cell: (ctx) => {
          return <Rating id={ctx.cell.id} value={ctx.getValue()} />;
        },
      }),
      columnHelper.accessor('userRating', {
        header: 'User Rating',
        cell: (ctx) => {
          const uuid = ctx.row.original.uuid;
          return (
            <Rating
              id={ctx.cell.id}
              value={ctx.getValue()}
              handleClick={(index) => {
                setLoadingAlbums((prev) => {
                  return { ...prev, [uuid]: true };
                });
                updateUserRatingMutation({ variables: { data: { uuid, rating: index + 1 } } });
              }}
              loading={loadingAlbums[uuid]}
            />
          );
        },
      }),
    ] satisfies ReturnType<typeof columnHelper.accessor>[];
    // Generic types from gql codegen cause a lot of typing noise when passing this array
    // into the table component. Using the columnHelper accessor type relieves this
  }, [columnHelper, loadingAlbums, updateUserRatingMutation]);

  return (
    <div className="w-full">
      <Heading tag="h1">Album Ratings Demo</Heading>
      <div className="mb-4">
        <p>I've seeded the database with some records by my favorite artists, including a star rating from 1 to 5.</p>
        <p>Do you have an opinion on any of these? Feel free to click a star to add your rating!</p>
        <p>
          Backend code for this demo <a href="https://github.com/tb9-Mason/express-api-demo">can be found here.</a>
        </p>
      </div>
      <div className="w-full">
        <Table<AlbumsQuery['albums'][0]> data={albums} columns={columns} />
      </div>
    </div>
  );
};
