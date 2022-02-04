import {
  useRef,
  useEffect,
} from 'react';

const useDidUpdate = (cb, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else {
      cb();
    }
  }, deps);
};

export default useDidUpdate;
