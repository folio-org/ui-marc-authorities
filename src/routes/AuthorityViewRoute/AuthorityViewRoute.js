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
} from '@folio/stripes/core';
import {
  SelectedAuthorityRecordContext,
  useMarcSource,
  useAuthority,
} from '@folio/stripes-authority-components';

import { AuthorityView } from '../../views';
import { QUERY_KEY_AUTHORITY_SOURCE } from '../../constants';

const AuthorityViewRoute = () => {
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

  const marcSource = useMarcSource(id, {
    onError: handleAuthorityLoadError,
  });
  const authority = useAuthority(id, authRefType, headingRef, {
    onError: handleAuthorityLoadError,
  });

  useEffect(() => {
    if (authority && !selectedAuthority) {
      setSelectedAuthority(authority.data);
    }
  }, [authority.data?.id]);

  return (
    <AuthorityView
      marcSource={marcSource}
      authority={authority}
    />
  );
};

export default AuthorityViewRoute;
