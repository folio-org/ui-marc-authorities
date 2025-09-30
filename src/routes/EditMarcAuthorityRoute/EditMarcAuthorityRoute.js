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

export const EditMarcAuthorityRoute = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });
  const { setIsGoingToBaseURL } = useContext(AuthoritiesSearchContext);

  const searchParams = new URLSearchParams(location.search);

  const onClose = useCallback(async recordId => {
    setIsGoingToBaseURL(false);

    history.push({
      pathname: `/marc-authorities/authorities/${recordId ?? ''}`,
      search: location.search,
      state: {
        editSuccessful: true,
        isClosingFocused: true,
      },
    });
  }, [setIsGoingToBaseURL, location.search, history]);

  const onSave = useCallback(async recordId => {
    if (recordId) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      await queryClient.invalidateQueries(namespace);
    }

    onClose(recordId);
  }, [onClose, namespace, queryClient]);

  return (
    <Pluggable
      type="quick-marc"
      basePath={match.path}
      onClose={onClose}
      onSave={onSave}
      externalId={match.params.id}
      action="edit"
      marcType="authority"
      isShared={searchParams.get('shared')}
      useRoutes={false}
      externalRecordPath="/marc-authorities/authorities"
    >
      <FormattedMessage id="ui-inventory.quickMarcNotAvailable" />
    </Pluggable>
  );
};
