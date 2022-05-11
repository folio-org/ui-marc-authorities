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

import { QUERY_KEY_AUTHORITIES } from '../../constants';

import { AuthoritiesSearchContext } from '../../context';

const AuthorityQuickMarcEditRoute = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });
  const { setIsGoingToBaseURL } = useContext(AuthoritiesSearchContext);

  const onClose = useCallback(async (recordRoute) => {
    const recordId = recordRoute.split('/')[1];

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
    >
      <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
    </Pluggable>
  );
};

export default AuthorityQuickMarcEditRoute;
