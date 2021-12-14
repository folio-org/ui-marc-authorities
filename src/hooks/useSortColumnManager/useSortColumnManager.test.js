import {
  renderHook,
  act,
} from '@testing-library/react-hooks';

import useSortColumnManager from './useSortColumnManager';
import {
  searchResultListColumns,
  sortOrders,
} from '../../constants';

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
    it('should return descending sort order and selected sortedColumn', () => {
      const { result } = renderHook(() => useSortColumnManager());

      act(() => {
        result.current.onHeaderClick('', { name: searchResultListColumns.AUTH_REF_TYPE });
      });

      expect(result.current.sortOrder).toBe(sortOrders.DES);
      expect(result.current.sortedColumn).toBe(searchResultListColumns.AUTH_REF_TYPE);
    });

    describe('when handle "onHeaderClick" twice on the same column', () => {
      it('should return ascending sort order and selected sortedColumn', () => {
        const { result } = renderHook(() => useSortColumnManager());

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
});
