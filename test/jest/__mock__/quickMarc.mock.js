jest.mock('@folio/quick-marc/src/QuickMarcView/QuickMarcView', () => ({ lastMenu }) => (
  <div>
    QuickMarcView
    {lastMenu}
  </div>
));
