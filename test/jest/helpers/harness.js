import { Router as DefaultRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import {
  AuthoritiesSearchContext,
  AuthoritiesSearchContextProvider,
} from '../../../src/context';
import IntlProvider from './intl';
import buildStripes from '../__mock__/stripesCore.mock';

const STRIPES = buildStripes();

const defaultHistory = createMemoryHistory();

const queryClient = new QueryClient();

const AuthotitiesSearchContextProviderMock = ({ children, ctxValue }) => (
  <AuthoritiesSearchContext.Provider value={ctxValue}>
    {children}
  </AuthoritiesSearchContext.Provider>
);

const Harness = ({
  Router = DefaultRouter,
  stripes,
  children,
  history = defaultHistory,
  authoritiesCtxValue,
}) => {
  const AuthoritiesCtxProviderComponent = authoritiesCtxValue
    ? AuthotitiesSearchContextProviderMock
    : AuthoritiesSearchContextProvider;

  return (
    <QueryClientProvider client={queryClient}>
      <StripesContext.Provider value={stripes || STRIPES}>
        <Router history={history}>
          <IntlProvider>
            <AuthoritiesCtxProviderComponent ctxValue={authoritiesCtxValue}>
              {children}
            </AuthoritiesCtxProviderComponent>
          </IntlProvider>
        </Router>
      </StripesContext.Provider>
    </QueryClientProvider>
  );
};

export default Harness;
