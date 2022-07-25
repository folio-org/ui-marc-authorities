import {
  useCallback,
  useContext,
} from 'react';
import {
  useHistory,
  useRouteMatch,
  useLocation,
} from 'react-router';
import { FormattedMessage } from 'react-intl';
import { useQueryClient } from 'react-query';

import {
  Pluggable,
  useNamespace,
} from '@folio/stripes/core';
import { AuthoritiesSearchContext } from '@folio/stripes-authority-components';

import { QUERY_KEY_AUTHORITIES } from '../../constants';

const AuthorityQuickMarcEditRoute = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });
  const { setIsGoingToBaseURL } = useContext(AuthoritiesSearchContext);

  const onClose = useCallback(async recordId => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    queryClient.invalidateQueries(namespace);
    setIsGoingToBaseURL(false);
    history.push({
      pathname: `/marc-authorities/authorities/${recordId}`,
      search: location.search,
      state: { editSuccessful: true },
    });
  }, [setIsGoingToBaseURL, location.search, history]);

  return (
    <Pluggable
      type="quick-marc"
      basePath={match.path}
      onClose={onClose}
      externalRecordPath="/marc-authorities/authorities"
    >
      <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
    </Pluggable>
  );
};

export default AuthorityQuickMarcEditRoute;
