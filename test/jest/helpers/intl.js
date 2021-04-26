import { IntlProvider } from 'react-intl';

import marcAuthoritiesTranslations from '../../../translations/ui-marc-authorities/en';

const prefixKeys = (translations, prefix) => {
  return Object
    .keys(translations)
    .reduce((acc, key) => (
      {
        ...acc,
        [`${prefix}.${key}`]: translations[key],
      }
    ), {});
};

const translations = {
  ...prefixKeys(marcAuthoritiesTranslations, 'ui-marc-authorities'),
};

const Intl = ({ children }) => (
  <IntlProvider
    locale="en"
    messages={translations}
  >
    {children}
  </IntlProvider>
);

export default Intl;
