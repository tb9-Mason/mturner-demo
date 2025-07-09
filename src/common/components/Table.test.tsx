import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from './Table';

interface TableTestData {
  col1: string;
  col2: number;
}

const TABLE_DATA: TableTestData[] = Array.from({ length: 40 }).map((_, index) => {
  return {
    col1: `val-${index}`,
    col2: index,
  };
});

const TestComponent = () => {
  const [data] = useState<TableTestData[]>(TABLE_DATA);
  const columnHelper = createColumnHelper<TableTestData>();
  const columns = useMemo(() => {
    return [
      columnHelper.accessor('col1', {
        header: 'Col1',
        cell: (ctx) => {
          return <span data-testid="col1-cell">{ctx.getValue()}</span>;
        },
      }),
      columnHelper.accessor('col2', {
        header: 'Col2',
        cell: (ctx) => {
          return <span data-testid="col2-cell">{ctx.getValue()}</span>;
        },
      }),
    ];
  }, [columnHelper]);
  return (
    <div>
      <Table<TableTestData> data={data} columns={columns} />
    </div>
  );
};

describe('Table', () => {
  test('renders', async () => {
    render(<TestComponent />);

    expect(Screen.allVisibleDataCells.length).toBe(10);
    expect(Screen.firstDataCell.textContent).toBe('val-0');
  });

  test('sorts on header click', async () => {
    render(<TestComponent />);

    await userEvent.click(Screen.col1SortButton);
    expect(Screen.firstDataCell.textContent).toBe('val-0');

    await userEvent.click(Screen.col1SortButton);
    expect(Screen.firstDataCell.textContent).toBe('val-39');
  });

  test('changes page size on selection', async () => {
    render(<TestComponent />);

    expect(Screen.allVisibleDataCells.length).toBe(10);

    await userEvent.selectOptions(Screen.pageSizeSelector, 'Show 30');
    expect(Screen.allVisibleDataCells.length).toBe(30);
  });

  test('changes page when clicking pagination buttons', async () => {
    render(<TestComponent />);

    expect(screen.getByText('1 of 4')).toBeInTheDocument();

    await userEvent.click(Screen.paginationNextButton);
    expect(screen.getByText('2 of 4')).toBeInTheDocument();

    await userEvent.click(Screen.paginationLastButton);
    expect(screen.getByText('4 of 4')).toBeInTheDocument();

    await userEvent.click(Screen.paginationPrevButton);
    expect(screen.getByText('3 of 4')).toBeInTheDocument();

    await userEvent.click(Screen.paginationFirstButton);
    expect(screen.getByText('1 of 4')).toBeInTheDocument();
  });
});

const Screen = {
  get allVisibleDataCells() {
    return screen.getAllByTestId('col1-cell');
  },
  get col1SortButton() {
    return screen.getByRole('button', { name: 'Col1' });
  },
  get firstDataCell() {
    return screen.getAllByTestId('col1-cell')[0];
  },
  get pageSizeSelector() {
    return screen.getByRole('combobox');
  },
  get paginationFirstButton() {
    return screen.getByRole('button', { name: 'First Page' });
  },
  get paginationLastButton() {
    return screen.getByRole('button', { name: 'Last Page' });
  },
  get paginationNextButton() {
    return screen.getByRole('button', { name: 'Next Page' });
  },
  get paginationPrevButton() {
    return screen.getByRole('button', { name: 'Previous Page' });
  },
};
