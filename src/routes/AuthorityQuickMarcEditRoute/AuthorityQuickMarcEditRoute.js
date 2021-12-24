import { useCallback } from 'react';
import {
  useHistory,
  useRouteMatch,
  useLocation,
} from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const AuthorityQuickMarcEditRoute = () => {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const onClose = useCallback((recordRoute) => {
    const recordId = recordRoute.split('/')[1];

    history.push({
      pathname: `/marc-authorities/authorities/${recordId}`,
      search: location.search,
    });
  }, [location.search, history]);

  return (
    <Pluggable
      type="quick-marc"
      basePath={match.path}
      onClose={onClose}
    >
      <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
    </Pluggable>
  );
};

export default AuthorityQuickMarcEditRoute;
