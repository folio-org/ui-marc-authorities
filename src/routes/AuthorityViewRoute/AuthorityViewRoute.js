import { useRouteMatch } from 'react-router';

import { AuthorityView } from '../../views';
import {
  useMarcSource,
  useAuthority,
} from '../../queries';

const AuthorityViewRoute = () => {
  const { params: { id } } = useRouteMatch();

  const marcSource = useMarcSource(id);
  const authority = useAuthority(id);

  return (
    <AuthorityView
      marcSource={marcSource}
      authority={authority}
    />
  );
};

export default AuthorityViewRoute;
