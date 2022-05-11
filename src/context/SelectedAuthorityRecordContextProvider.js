import {
  createContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const SelectedAuthorityRecordContext = createContext();

const propTypes = {
  children: PropTypes.node.isRequired,
};

const SelectedAuthorityRecordContextProvider = ({ children }) => {
  const [selectedAuthorityRecordContext, setSelectedAuthorityRecordContext] = useState(null);

  return (
    <SelectedAuthorityRecordContext.Provider value={[selectedAuthorityRecordContext, setSelectedAuthorityRecordContext]}>
      {children}
    </SelectedAuthorityRecordContext.Provider>
  );
};

SelectedAuthorityRecordContextProvider.propTypes = propTypes;

export {
  SelectedAuthorityRecordContext,
  SelectedAuthorityRecordContextProvider,
};
