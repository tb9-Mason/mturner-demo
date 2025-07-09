import { Suspense, useCallback, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { QueryRef, useMutation, useReadQuery } from '@apollo/client';
import { createColumnHelper } from '@tanstack/react-table';
import { AlbumsQuery } from '../../gql/graphql';
import { dateFormatter } from '../../common/utilities';
import { Heading, RouteLoadingIndicator, Table, ChipList } from '../../common/components';
import { UPDATE_ALBUM_RATING } from './queries/albums.queries';
import { Rating } from './components';

interface MusicTableProps {
  queryRef: QueryRef<AlbumsQuery>;
}

const TECHNOLOGIES = ['React.js', 'TypeScript', 'Node/Express', 'GraphQL', 'Tailwind', 'HeadlessUI', 'Tanstack Table'];

const MusicTable = ({ queryRef }: MusicTableProps) => {
  // Read the query ref and set in state
  const { data } = useReadQuery<AlbumsQuery>(queryRef);
  const [albums, setAlbums] = useState(data.albums);
  const [loadingAlbums, setLoadingAlbums] = useState<Record<string, boolean>>({});

  const [updateUserRatingMutation] = useMutation(UPDATE_ALBUM_RATING);
  const columnHelper = createColumnHelper<AlbumsQuery['albums'][0]>();

  const handleUpdateRating = useCallback(
    async (uuid: string, rating: number) => {
      setLoadingAlbums((prev) => ({ ...prev, [uuid]: true }));

      try {
        // Parse the response directly instead of handling with separate data and error useEffects
        // Allows scoping "loading" data to a single row instead of being global
        const response = await updateUserRatingMutation({
          variables: { data: { uuid, rating } },
        });

        if (response.data?.updateUserRating.userRating) {
          const {
            data: {
              updateUserRating: { userRating },
            },
          } = response;
          setAlbums((prev) => {
            return prev.map((item) => (item.uuid === uuid ? { ...item, userRating } : item));
          });
        }
      } catch {
        // This error is caught by the client errorLink
      } finally {
        setLoadingAlbums((prev) => ({ ...prev, [uuid]: false }));
      }
    },
    [updateUserRatingMutation],
  );

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
        size: 250,
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
                handleUpdateRating(uuid, index + 1);
              }}
              loading={loadingAlbums[uuid]}
            />
          );
        },
      }),
    ];
  }, [columnHelper, handleUpdateRating, loadingAlbums]);

  return (
    <div className="w-full">
      <Heading tag="h1" className="mb-2">
        Album Ratings Demo
      </Heading>
      <ChipList list={TECHNOLOGIES} />
      <div className="mb-4 mt-2">
        <p>I've seeded the database with some records by my favorite artists, including a star rating from 1 to 5.</p>
        <p>Do you have an opinion on any of these? Feel free to click a star to add your rating!</p>
        <p>
          Backend code for this demo <a href="https://github.com/tb9-Mason/express-api-demo">can be found here.</a>
        </p>
      </div>
      <div className="w-full">
        <Table<AlbumsQuery['albums'][0]>
          data={albums}
          columns={columns}
          initialState={{ sorting: [{ id: 'staticRating', desc: true }] }}
        />
      </div>
    </div>
  );
};

// Use a wrapper to allow the queryRef to trigger suspense behavior
export const MusicTableWrapper = () => {
  // Get the prefetched query from the route loader
  const queryRef = useLoaderData();
  return (
    <Suspense fallback={<RouteLoadingIndicator />}>
      <MusicTable queryRef={queryRef} />
    </Suspense>
  );
};
