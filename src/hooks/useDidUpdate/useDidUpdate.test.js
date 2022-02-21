import { renderHook } from '@testing-library/react-hooks';

import useDidUpdate from './useDidUpdate';
import { wait } from '../../../test/jest/helpers/wait';

const callback = jest.fn();

describe('useDidUpdate hook', () => {
  it('should not call callback after just mounting', async () => {
    renderHook(() => useDidUpdate(callback));

    await wait(200);

    expect(callback).not.toHaveBeenCalled();
  });

  describe('when a dependency changes', () => {
    it('should call callback', async () => {
      const initialDeps = [{}];
      const updatedDeps = [{}];

      const { rerender } = renderHook(useDidUpdate, callback, initialDeps);

      await wait(200);

      expect(callback).not.toHaveBeenCalled();

      rerender(callback, updatedDeps);

      expect(callback).toHaveBeenCalled();
    });
  });
});
