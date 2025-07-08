import { render, screen } from '@testing-library/react';

import { MusicTableWrapper } from './MusicTable';
import userEvent from '@testing-library/user-event';
import { AlbumsQuery } from '../../gql/graphql';

describe('MusicTable', () => {
  test('renders rows', async () => {
    render(<MusicTableWrapper />);

    // 3, as the header row is also included in this query
    expect(screen.getAllByRole('row').length).toBe(3);
  });

  test('requests a mutation when clicking a user rating and updates the data with the response', async () => {
    render(<MusicTableWrapper />);

    expect(screen.getAllByText('empty').length).toBe(20);
    expect(screen.queryAllByText('full').length).toBe(0);

    await userEvent.click(Screen.ratingButton);

    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        data: {
          rating: 1,
          uuid: 'abc123',
        },
      },
    });

    // The userRating is 1, so one fewer empty star and one full star present
    expect(screen.getAllByText('empty').length).toBe(19);
    expect(screen.getAllByText('full').length).toBe(1);
  });
});

const Screen = {
  get ratingButton() {
    return screen.getAllByRole('button', { name: 'empty Rate 1 stars' })[0];
  },
};

const mockedResponse: AlbumsQuery = {
  albums: [
    {
      name: 'album 1',
      releaseDate: new Date('04-24-2024'),
      uuid: 'abc123',
      staticRating: 0,
      userRating: 0,
      link: 'http://www.example.com',
      artist: { name: 'artist 1' },
    },
    {
      name: 'album 2',
      releaseDate: new Date('04-24-2020'),
      uuid: 'def456',
      staticRating: 0,
      userRating: 0,
      link: 'http://www.test.com',
      artist: { name: 'artist 2' },
    },
  ],
};

const mockMutation = vi.fn(() => ({ data: { updateUserRating: { userRating: 1 } } }));

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    useLoaderData: vi.fn(() => null),
  };
});

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');

  return {
    ...actual,
    useReadQuery: vi.fn(() => ({ data: mockedResponse })),
    useMutation: vi.fn(() => [mockMutation]),
  };
});

vi.mock('@heroicons/react/24/solid', () => ({
  StarIcon: () => <div>full</div>,
}));

vi.mock('@heroicons/react/24/outline', () => ({
  StarIcon: () => <div>empty</div>,
}));
