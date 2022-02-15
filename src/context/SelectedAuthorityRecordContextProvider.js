import {
  createContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';

export const SelectedAuthorityRecordContext = createContext();

export const SelectedAuthorityRecordContextProvider = ({ children }) => {
  const [selectedAuthorityRecordContext, setSelectedAuthorityRecordContext] = useState(null);

  return (
    <SelectedAuthorityRecordContext.Provider value={[selectedAuthorityRecordContext, setSelectedAuthorityRecordContext]}>
      {children}
    </SelectedAuthorityRecordContext.Provider>
  );
};

SelectedAuthorityRecordContextProvider.propTypes = {
  children: PropTypes.node,
};
