import {
  useCallback,
  useContext,
} from 'react';
import {
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router';
import { FormattedMessage } from 'react-intl';
import { useQueryClient } from 'react-query';

import {
  Pluggable,
  useNamespace,
  useStripes,
} from '@folio/stripes/core';
import {
  AuthoritiesSearchContext,
  useAuthority,
} from '@folio/stripes-authority-components';

import { QUERY_KEY_AUTHORITIES } from '../../constants';


export const EditMarcAuthorityRoute = () => {
  const stripes = useStripes();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const { setIsGoingToBaseURL } = useContext(AuthoritiesSearchContext);
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: QUERY_KEY_AUTHORITIES });

  const { externalId } = match.params;
  const searchParams = new URLSearchParams(location.search);
  const isShared = searchParams.get('shared') === 'true';
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const { refetch } = useAuthority({
    recordId: externalId,
    tenantId: isShared ? centralTenantId : '',
  });

  const fetchAuthority = async () => {
    const { data } = await refetch();

    return data;
  };

  const onClose = useCallback(recordRoute => {
    setIsGoingToBaseURL(false);

    const newSearchParams = new URLSearchParams(location.search);

    newSearchParams.delete('shared');

    history.push({
      pathname: `/marc-authorities/view/${recordRoute ?? ''}`,
      search: newSearchParams.toString(),
      state: {
        isClosingFocused: true,
      },
    });
  }, [location.search, history, setIsGoingToBaseURL]);

  const onSave = useCallback(async recordId => {
    // when editing a record we need to invalidate cached Authority search results
    // otherwise if a 1XX/4XX/5XX was updated in MARC - we wouldn't see a highlighted
    // heading/reference in the Authority View pane
    await new Promise(resolve => setTimeout(resolve, 1000));
    await queryClient.invalidateQueries(namespace);

    onClose(recordId);
  }, [onClose, namespace, queryClient]);

  return (
    <div data-test-marc-authorities-quick-marc>
      <Pluggable
        type="quick-marc"
        basePath={match.path}
        onClose={onClose}
        onSave={onSave}
        externalRecordPath="/marc-authorities/view"
        action="edit"
        marcType="authority"
        externalId={externalId}
        isShared={isShared}
        useRoutes={false}
        fetchExternalRecord={fetchAuthority}
      >
        <span data-test-marc-authorities-quick-marc-no-plugin>
          <FormattedMessage id="ui-marc-authorities.quickMarcNotAvailable" />
        </span>
      </Pluggable>
    </div>
  );
};
