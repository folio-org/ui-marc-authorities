import { renderHook } from '@testing-library/react-hooks';

import useReportGenerator from './useReportGenerator';

describe('useReportGenerator', () => {
  it('parses records', () => {
    const { result } = renderHook(() => useReportGenerator('test-file-name'));

    const parsedIds = result.current.parse(['id-1']);

    expect(parsedIds).toEqual([{ id: 'id-1' }]);
  });

  it('converts to .csv file', () => {
    const { result } = renderHook(() => useReportGenerator('test-file-name'));

    result.current.toCSV(['id-1']);

    expect(result.current.toCSV(['id-1'])).toBeUndefined();
  });
});
