import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { searchResultListColumns } from '@folio/stripes-authority-components';

import useSortColumnManager from './useSortColumnManager';
import { sortOrders } from '../../constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: 'pathname',
    search: '',
  }),
}));

const sortableColumns = [
  searchResultListColumns.AUTH_REF_TYPE,
  searchResultListColumns.HEADING_REF,
  searchResultListColumns.HEADING_TYPE,
];

const mockSetSortedColumn = jest.fn();
const mockSetSortOrder = jest.fn();

describe('Given useSortColumnManager', () => {
  describe('when handle "onHeaderClick" action', () => {
    describe('when clicked column is not the sortable column', () => {
      it('should not change anything', () => {
        const { result } = renderHook(() => useSortColumnManager({
          setSortedColumn: mockSetSortedColumn,
          setSortOrder: mockSetSortOrder,
          sortableColumns: [],
        }));

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        expect(mockSetSortedColumn).not.toHaveBeenCalled();
        expect(mockSetSortOrder).not.toHaveBeenCalled();
      });
    });

    describe('when given sortableColumns option parameter', () => {
      it('should change sortedColumn and sortOrder for sortableColumns only', () => {
        const { result } = renderHook(() => useSortColumnManager({
          setSortedColumn: mockSetSortedColumn,
          setSortOrder: mockSetSortOrder,
          sortableColumns,
        }));

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        expect(mockSetSortedColumn).toHaveBeenCalledWith(searchResultListColumns.AUTH_REF_TYPE);
        expect(mockSetSortOrder).toHaveBeenCalledWith(sortOrders.ASC);
      });
    });

    describe('when handle "onHeaderClick" twice on the same column', () => {
      it('should change sortOrder to descending', () => {
        const { result } = renderHook(() => useSortColumnManager({
          sortOrder: sortOrders.ASC,
          sortedColumn: searchResultListColumns.AUTH_REF_TYPE,
          setSortedColumn: mockSetSortedColumn,
          setSortOrder: mockSetSortOrder,
          sortableColumns,
        }));

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        expect(mockSetSortOrder).toHaveBeenLastCalledWith(sortOrders.DES);
      });
    });
  });
});
