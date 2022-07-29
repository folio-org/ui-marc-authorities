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
  SelectedAuthorityRecordContext,
  SelectedAuthorityRecordContextProvider,
} from '@folio/stripes-authority-components';

import IntlProvider from './intl';
import buildStripes from '../__mock__/stripesCore.mock';

const STRIPES = buildStripes();

const defaultHistory = createMemoryHistory();

const queryClient = new QueryClient();

const AuthoritiesSearchContextProviderMock = ({ children, ctxValue }) => (
  <AuthoritiesSearchContext.Provider value={ctxValue}>
    {children}
  </AuthoritiesSearchContext.Provider>
);

const SelectedAuthorityRecordContextProviderMock = ({ children, ctxValue }) => (
  <SelectedAuthorityRecordContext.Provider value={ctxValue}>
    {children}
  </SelectedAuthorityRecordContext.Provider>
);

const Harness = ({
  Router = DefaultRouter,
  stripes,
  children,
  history = defaultHistory,
  authoritiesCtxValue,
  selectedRecordCtxValue,
}) => {
  const AuthoritiesCtxProviderComponent = authoritiesCtxValue
    ? AuthoritiesSearchContextProviderMock
    : AuthoritiesSearchContextProvider;

  const SelectedAuthorityRecordCtxProviderComponent = selectedRecordCtxValue
    ? SelectedAuthorityRecordContextProviderMock
    : SelectedAuthorityRecordContextProvider;

  return (
    <QueryClientProvider client={queryClient}>
      <StripesContext.Provider value={stripes || STRIPES}>
        <Router history={history}>
          <IntlProvider>
            <SelectedAuthorityRecordCtxProviderComponent ctxValue={selectedRecordCtxValue}>
              <AuthoritiesCtxProviderComponent ctxValue={authoritiesCtxValue}>
                {children}
              </AuthoritiesCtxProviderComponent>
            </SelectedAuthorityRecordCtxProviderComponent>
          </IntlProvider>
        </Router>
      </StripesContext.Provider>
    </QueryClientProvider>
  );
};

export default Harness;
