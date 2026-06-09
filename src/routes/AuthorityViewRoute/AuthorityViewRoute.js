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

const canLoadMarcSource = (isConsortiaEnv, isShared, isConsortiumDataLoaded, isAuthorityLoaded) => {
  /*
    There is a delay between loading consortia data and when it becomes available in `stripes.user.user`.
    If an authority record is loaded before consortia data is available
    then we fetch MARC source from a member tenant, which is incorrect for shared records
    Because of this we need to have a more complex condition to enable MARC source requests at an appropriate time
  */
  if (!isAuthorityLoaded) {
    return false;
  }

  if (!isConsortiaEnv) {
    return true;
  }

  if (isShared && !isConsortiumDataLoaded) {
    return false;
  }

  return true;
};

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
  const authority = useAuthority({ recordId: id, authRefType, headingRef, refetchOnEmptyResults: location.state?.isNewRecord }, {
    onError: handleAuthorityLoadError,
  });

  const isConsortiaEnv = stripes.hasInterface('consortium');
  const isShared = Boolean(selectedAuthority?.shared);
  const isConsortiumDataLoaded = Boolean(stripes.user.user.consortium);
  const isAuthorityLoaded = Boolean(selectedAuthority);

  const isMarcSourceRequestEnabled = canLoadMarcSource(isConsortiaEnv, isShared, isConsortiumDataLoaded, isAuthorityLoaded);

  const marcSource = useMarcSource({ recordId: id, tenantId, enabled: isMarcSourceRequestEnabled }, {
    onError: handleAuthorityLoadError,
  });

  useEffect(() => {
    if (authority?.data && !selectedAuthority) {
      setSelectedAuthority(authority?.data);
    }
  }, [authority?.data, setSelectedAuthority, selectedAuthority]);

  // clear selected authority on unmount, so that we won't have any remaining data
  // that could affect other parts of the app
  useEffect(() => {
    return () => {
      setSelectedAuthority(null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // `isNewRecord` is set in `CreateMarcAuthorityRoute` and is needed to
    // retry feching a created Authority record. The record might not be
    // available via search immediately after creation since reindexing might take
    // a few moments.
    // After we've successfully fetched this record - we should reset `isNewRecord` to false
    if (authority?.data && location.state?.isNewRecord) {
      history.replace({
        state: { ...location.state, isNewRecord: false },
      });
    }
  }, [authority?.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthorityView
      marcSource={marcSource}
      authority={authority}
    />
  );
};

export default AuthorityViewRoute;
