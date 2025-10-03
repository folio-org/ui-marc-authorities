import {
  useContext,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { TitleManager } from '@folio/stripes/core';
import {
  AuthoritiesSearchContext,
  SelectedAuthorityRecordContext,
} from '@folio/stripes-authority-components';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const AuthorityTitleManager = ({ children = null }) => {
  const intl = useIntl();

  const { searchQuery, navigationSegmentValue } = useContext(AuthoritiesSearchContext);
  const [selectedAuthority] = useContext(SelectedAuthorityRecordContext);

  const pageTitle = useMemo(() => {
    if (selectedAuthority) {
      return intl.formatMessage({ id: 'ui-marc-authorities.documentTitle.record' }, { headingRef: selectedAuthority.headingRef });
    }

    if (searchQuery) {
      return intl.formatMessage({ id: `ui-marc-authorities.documentTitle.${navigationSegmentValue}` }, { query: searchQuery });
    }

    return intl.formatMessage({ id: 'ui-marc-authorities.meta.title' });
  }, [intl, navigationSegmentValue, searchQuery, selectedAuthority]);

  return (
    <TitleManager page={pageTitle}>
      {children}
    </TitleManager>
  );
};

AuthorityTitleManager.propTypes = propTypes;

export { AuthorityTitleManager };
