import { dayjs } from '@folio/stripes/components';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import useReportGenerator from './useReportGenerator';

const MOCK_FILENAME = 'test-file-name';
const MOCK_IDS = ['id-1'];
const MOCK_FORMATTED_DATE = '2022-05-13T14:00:18+05:00';

jest.mock('@folio/stripes/components', () => ({
  dayjs: jest.fn().mockReturnValue({}),
}));

describe('useReportGenerator', () => {
  beforeEach(() => {
    dayjs.mockClear().mockReturnValue({
      format: jest.fn().mockReturnValue(MOCK_FORMATTED_DATE),
    });
  });

  it('parses records', () => {
    const { result } = renderHook(() => useReportGenerator(MOCK_FILENAME));

    const parsedIds = result.current.parse(MOCK_IDS);

    expect(parsedIds).toEqual([{ id: MOCK_IDS[0] }]);
  });

  it('converts to .csv file', () => {
    const { result } = renderHook(() => useReportGenerator(MOCK_FILENAME));

    expect(result.current.toCSV(MOCK_IDS)).toEqual({
      filename: `${MOCK_FILENAME}${MOCK_FORMATTED_DATE}`,
    });
  });
});
