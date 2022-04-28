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

const getWrapper = (selectedRecord) => ({ children }) => (
  <Harness selectedRecordCtxValue={[selectedRecord]}>
    {children}
  </Harness>
);

describe('Given useHighlightEditedRecord', () => {
  describe('when previous authorities are empty', () => {
    it('should not return a record to highlight', async () => {
      const prevAuthorities = [];
      const selectedRecord = {};
      const { result } = renderHook(() => useHighlightEditedRecord(prevAuthorities), { wrapper: getWrapper(selectedRecord) });

      expect(result.current).toBeNull();
    });
  });
});
