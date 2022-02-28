import {
  useContext,
  useEffect,
} from 'react';
import {
  useRouteMatch,
  useLocation,
} from 'react-router';
import queryString from 'query-string';

import { AuthorityView } from '../../views';
import { SelectedAuthorityRecordContext } from '../../context';
import {
  useMarcSource,
  useAuthority,
} from '../../queries';

const AuthorityViewRoute = () => {
  const { params: { id } } = useRouteMatch();
  const location = useLocation();
  const [selectedAuthority, setSelectedAuthority] = useContext(SelectedAuthorityRecordContext);
  const searchParams = queryString.parse(location.search);

  const headingRef = selectedAuthority?.headingRef || searchParams.headingRef;
  const authRefType = selectedAuthority?.authRefType || searchParams.authRefType;

  const marcSource = useMarcSource(id);
  const authority = useAuthority(id, authRefType, headingRef);

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
