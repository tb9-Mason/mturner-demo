import { useReadQuery } from '@apollo/client';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router';
import { AlbumsQuery } from '../../gql/graphql';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { dateFormatter } from '../../common/utilities';
import { Heading } from '../../common/components';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as UnfilledStarIcon } from '@heroicons/react/24/outline';

export const MusicTable = () => {
  const { albums: albumsQueryRef } = useLoaderData();
  const { data } = useReadQuery<AlbumsQuery>(albumsQueryRef);
  const columnHelper = createColumnHelper<AlbumsQuery['albums'][0]>();

  const albums = useMemo(() => {
    // Set a stable reference for albums for the table
    // See https://tanstack.com/table/latest/docs/guide/data#give-data-a-stable-reference
    return data.albums;
  }, [data]);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
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
        return (
          <Rating
            id={ctx.cell.id}
            value={ctx.getValue()}
            handleClick={(index) => {
              // TODO: update rating
              console.log(index, ctx.row.original.uuid);
            }}
          />
        );
      },
    }),
  ];

  const table = useReactTable({ columns, data: albums, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="w-full">
      <Heading tag="h1">Album Ratings Demo</Heading>
      <div className="mb-4">
        <p>I've seeded the database with some of my favorite records, including a star rating from 1 to 5.</p>
        <p>Do you have an opinion on any of these? Feel free to click a star to add your rating!</p>
        <p>
          Backend code for this demo <a href="https://github.com/tb9-Mason/express-api-demo">can be found here.</a>
        </p>
      </div>
      <table className="border w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b-2">
              {hg.headers.map((h) => (
                <th key={h.id} className="p-2 text-left">
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="border-b">
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className="p-2">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface RatingProps {
  id: string;
  value: number;
  handleClick?: (index: number) => void;
}

const Rating = ({ id, value, handleClick }: RatingProps) => {
  const MAX_RATING = 5;
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars !== 0;
  const halfStars = hasHalf ? 1 : 0;
  const emptyStars = MAX_RATING - fullStars - halfStars;
  const starComponents: Array<typeof StarIcon | typeof HalfStar | typeof UnfilledStarIcon> = [
    ...(Array.from({ length: fullStars }).fill(StarIcon) as Array<typeof StarIcon>),
    ...(Array.from({ length: halfStars }).fill(HalfStar) as Array<typeof HalfStar>),
    ...(Array.from({ length: emptyStars }).fill(UnfilledStarIcon) as Array<typeof UnfilledStarIcon>),
  ];

  return (
    <div className="flex flex-row gap-1">
      {starComponents.map((El, i) => {
        const renderKey = `${id}-${i}`;
        // If a click handler is present, wrap the element in a button and attach the handler
        return handleClick ? (
          <button key={renderKey} onClick={() => handleClick(i)}>
            <El className="size-5" />
            <span className="sr-only">Rate {i + 1} stars</span>
          </button>
        ) : (
          <El key={renderKey} className="size-5" />
        );
      })}
    </div>
  );
};

// Heroicons doesn't include a half star icon, so I'm faking one here
const HalfStar = () => {
  return (
    <span className="block relative size-5">
      <UnfilledStarIcon className="absolute inset-0" />
      <span className="absolute inset-0 w-1/2 overflow-hidden">
        <StarIcon className="size-5" />
      </span>
    </span>
  );
};
