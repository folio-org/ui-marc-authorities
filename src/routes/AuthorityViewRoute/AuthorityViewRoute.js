import {
  useContext,
  useEffect,
} from 'react';
import {
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router';
import { useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import omit from 'lodash/omit';

import {
  useNamespace,
  useCallout,
  useStripes,
} from '@folio/stripes/core';
import {
  SelectedAuthorityRecordContext,
  useMarcSource,
  useAuthority,
  QUERY_KEY_AUTHORITY_SOURCE,
} from '@folio/stripes-authority-components';

import { AuthorityView } from '../../views';

const AuthorityViewRoute = () => {
  const stripes = useStripes();
  const { params: { id } } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [selectedAuthority, setSelectedAuthority] = useContext(SelectedAuthorityRecordContext);
  const authoritySourceNamespace = useNamespace({ key: QUERY_KEY_AUTHORITY_SOURCE });
  const callout = useCallout();
  const intl = useIntl();

  const searchParams = queryString.parse(location.search);

  const headingRef = selectedAuthority?.headingRef || searchParams.headingRef;
  const authRefType = selectedAuthority?.authRefType || searchParams.authRefType;
  const tenantId = selectedAuthority?.shared ? stripes.user.user.consortium?.centralTenantId : selectedAuthority?.tenantId;

  const handleAuthorityLoadError = async err => {
    const errorResponse = await err.response;

    const calloutMessageId = errorResponse.status === 404
      ? 'stripes-authority-components.authority.view.error.notFound'
      : 'stripes-authority-components.authority.view.error.unknown';

    const search = omit(queryString.parse(location.search), ['authRefType', 'headingRef']);

    callout.sendCallout({ type: 'error', message:  intl.formatMessage({ id: calloutMessageId }) });
    queryClient.invalidateQueries(authoritySourceNamespace);
    history.push({
      pathname: '/marc-authorities',
      search: queryString.stringify(search),
    });
  };

  // There is no need to change the tenant for this API.
  const authority = useAuthority({ recordId: id, authRefType, headingRef }, {
    onError: handleAuthorityLoadError,
  });
  const marcSource = useMarcSource({ recordId: id, tenantId, enabled: Boolean(selectedAuthority) }, {
    onError: handleAuthorityLoadError,
  });

  useEffect(() => {
    if (authority && !selectedAuthority) {
      setSelectedAuthority(authority.data);
    }
  }, [authority?.data?.id]);

  return (
    <AuthorityView
      marcSource={marcSource}
      authority={authority}
    />
  );
};

export default AuthorityViewRoute;
