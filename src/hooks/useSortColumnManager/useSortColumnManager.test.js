import {
  renderHook,
  act,
} from '@testing-library/react-hooks';

import useSortColumnManager from './useSortColumnManager';
import {
  searchResultListColumns,
  sortOrders,
} from '../../constants';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: 'pathname',
    search: '',
  }),
}));

describe('Given useSortColumnManager', () => {
  it('should return default values', () => {
    const { result } = renderHook(() => useSortColumnManager());
    const {
      sortOrder,
      sortedColumn,
    } = result.current;

    expect(sortOrder).toBe('');
    expect(sortedColumn).toBe('');
  });

  describe('when handle "onHeaderClick" action', () => {
    it('should return ascending sortOrder and selected sortedColumn', () => {
      const { result } = renderHook(() => useSortColumnManager());

      act(() => {
        result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
      });

      expect(result.current.sortOrder).toBe(sortOrders.ASC);
      expect(result.current.sortedColumn).toBe(searchResultListColumns.AUTH_REF_TYPE);
    });

    describe('when handle "onHeaderClick" twice on the same column', () => {
      it('should return descending sortOrder and selected sortedColumn', () => {
        const { result } = renderHook(() => useSortColumnManager());

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        expect(result.current.sortOrder).toBe(sortOrders.DES);
        expect(result.current.sortedColumn).toBe(searchResultListColumns.AUTH_REF_TYPE);
      });
    });

    describe('when handle "onHeaderClick" three time on the same column', () => {
      it('should return ascending sortOrder and selected sortedColumn', () => {
        const { result } = renderHook(() => useSortColumnManager());

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        act(() => {
          result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
        });

        expect(result.current.sortOrder).toBe(sortOrders.ASC);
        expect(result.current.sortedColumn).toBe(searchResultListColumns.AUTH_REF_TYPE);
      });
    });
  });

  describe('when handle "onChangeSortOption" with empty data', () => {
    it('should return empty sortOrder and sortedColumn', () => {
      const { result } = renderHook(() => useSortColumnManager());

      act(() => {
        result.current.onChangeSortOption('');
      });

      expect(result.current.sortOrder).toBe('');
      expect(result.current.sortedColumn).toBe('');
    });
  });

  describe('when handle "onChangeSortOption" with sortedColumn option', () => {
    it('should return ascending sortOrder and selected sortedColumn', () => {
      const { result } = renderHook(() => useSortColumnManager());

      act(() => {
        result.current.onChangeSortOption(searchResultListColumns.AUTH_REF_TYPE);
      });

      expect(result.current.sortOrder).toBe(sortOrders.ASC);
      expect(result.current.sortedColumn).toBe(searchResultListColumns.AUTH_REF_TYPE);
    });
  });

  describe('when handle "onChangeSortOption" with sortedColumn option and sortOrder', () => {
    it('should return selected sortOrder and selected sortedColumn', () => {
      const { result } = renderHook(() => useSortColumnManager());

      act(() => {
        result.current.onChangeSortOption(searchResultListColumns.AUTH_REF_TYPE, sortOrders.ASC);
      });

      expect(result.current.sortOrder).toBe(sortOrders.ASC);
      expect(result.current.sortedColumn).toBe(searchResultListColumns.AUTH_REF_TYPE);
    });
  });
});
