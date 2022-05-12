import { renderHook } from '@testing-library/react-hooks';

import { useHighlightEditedRecord } from './useHighlightEditedRecord';
import Harness from '../../../../test/jest/helpers/harness';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockReturnValue({
    state: {
      editSuccessful: true,
    },
  }),
}));

const getWrapper = (selectedRecord) => function ({ children }) {
  return (
    <Harness
      selectedRecordCtxValue={[selectedRecord]}
    >
      {children}
    </Harness>
  );
};

describe('Given useHighlightEditedRecord', () => {
  describe('when previous authorities are empty', () => {
    it('should not return a record to highlight', () => {
      const prevAuthorities = [];
      const selectedRecord = {};
      const { result } = renderHook(() => useHighlightEditedRecord(prevAuthorities), { wrapper: getWrapper(selectedRecord) });

      expect(result.current).toBeNull();
    });
  });

  describe('when previous and new authorities are same', () => {
    it('should not return a record to highlight', async () => {
      const prevAuthorities = [{
        id: 'id-1',
      }];
      const selectedRecord = {};
      const {
        result,
        rerender,
      } = renderHook(() => useHighlightEditedRecord(prevAuthorities), { wrapper: getWrapper(selectedRecord) });

      rerender(prevAuthorities);

      expect(result.current).toBeNull();
    });
  });

  describe('when no record is selected in context', () => {
    it('should not return a record to highlight', async () => {
      const prevAuthorities = [{
        id: 'id-1',
        headingRef: 'Heading 1',
        authRefType: 'Authorized',
      }];
      const authorities = [{
        id: 'id-1',
        headingRef: 'Heading 2',
        authRefType: 'Authorized',
      }];
      const selectedRecord = null;
      const {
        result,
        rerender,
      } = renderHook(useHighlightEditedRecord, {
        initialProps: [prevAuthorities],
        wrapper: getWrapper(selectedRecord),
      });

      rerender(authorities);

      expect(result.current).toBeNull();
    });
  });

  describe('when there is a selected record in new authorities', () => {
    it('should not return a record to highlight', async () => {
      const prevAuthorities = [{
        id: 'id-1',
        headingRef: 'Test authority',
        authRefType: 'Authorized',
      }, {
        id: 'id-2',
        headingRef: 'Other test authority',
        authRefType: 'Authorized',
      }];
      const authorities = [{
        id: 'id-1',
        headingRef: 'Test authority',
        authRefType: 'Authorized',
      }, {
        id: 'id-2',
        headingRef: 'Other test authority',
        authRefType: 'Authorized',
      }];
      const selectedRecord = {
        id: 'id-2',
        headingRef: 'Other test authority',
        authRefType: 'Authorized',
      };

      const {
        result,
        rerender,
      } = renderHook(useHighlightEditedRecord, {
        initialProps: [prevAuthorities],
        wrapper: getWrapper(selectedRecord),
      });

      rerender(authorities);

      expect(result.current).toBeNull();
    });
  });

  describe('when there is only one record that differs by headingRef', () => {
    it('should return that record to highlight', async () => {
      const prevAuthorities = [{
        id: 'id-1',
        headingRef: 'Test authority',
        authRefType: 'Authorized',
      }, {
        id: 'id-2',
        headingRef: 'Other test authority',
        authRefType: 'Authorized',
      }];
      const authorities = [{
        id: 'id-1',
        headingRef: 'Test authority',
        authRefType: 'Authorized',
      }, {
        id: 'id-2',
        headingRef: 'Other test authority (EDIT)',
        authRefType: 'Authorized',
      }];
      const selectedRecord = {
        id: 'id-2',
        headingRef: 'Other test authority',
        authRefType: 'Authorized',
      };

      const {
        result,
        rerender,
      } = renderHook(useHighlightEditedRecord, {
        initialProps: [prevAuthorities],
        wrapper: getWrapper(selectedRecord),
      });

      rerender(authorities);

      expect(result.current).toEqual(authorities[1]);
    });
  });

  describe('when there are more than one records that differ by headingRef', () => {
    it('should return record that matches by id, authRefType and headingType', async () => {
      const prevAuthorities = [{
        id: 'id-1',
        headingRef: 'Test authority',
        authRefType: 'Authorized',
        headingType: 'Personal name',
      }, {
        id: 'id-1',
        headingRef: 'Other test authority',
        authRefType: 'Reference',
        headingType: 'Personal name',
      }];
      const authorities = [{
        id: 'id-1',
        headingRef: 'Test authority (EDIT)',
        authRefType: 'Authorized',
        headingType: 'Personal name',
      }, {
        id: 'id-1',
        headingRef: 'Other test authority (EDIT)',
        authRefType: 'Reference',
        headingType: 'Personal name',
      }];
      const selectedRecord = {
        id: 'id-1',
        headingRef: 'Other test authority',
        authRefType: 'Reference',
        headingType: 'Personal name',
      };

      const {
        result,
        rerender,
      } = renderHook(useHighlightEditedRecord, {
        initialProps: [prevAuthorities],
        wrapper: getWrapper(selectedRecord),
      });

      rerender(authorities);

      expect(result.current).toEqual(authorities[1]);
    });
  });
});
