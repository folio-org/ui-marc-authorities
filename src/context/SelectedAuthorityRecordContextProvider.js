import {
  createContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';

export const SelectedAuthorityRecordContext = createContext();

export const SelectedAuthorityRecordContextProvider = ({ children }) => {
  const [recordRowContext, setRecordRowContext] = useState(null);

  return (
    <SelectedAuthorityRecordContext.Provider value={[recordRowContext, setRecordRowContext]}>
      {children}
    </SelectedAuthorityRecordContext.Provider>
  );
};

SelectedAuthorityRecordContextProvider.propTypes = {
  children: PropTypes.node,
};
