import {
  useCallback,
  useContext,
} from 'react';
import {
  useHistory,
  useRouteMatch,
} from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

import { AuthoritiesSearchContext } from '../../context';

const AuthorityQuickMarcEditRoute = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const { setIsGoingToBaseURL } = useContext(AuthoritiesSearchContext);

  const onClose = useCallback(() => {
    setTimeout(() => {
      setIsGoingToBaseURL(false);

      history.goBack();
    }, 1000);
  }, [setIsGoingToBaseURL, history]);

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
