jest.mock('@folio/quick-marc/src/QuickMarcView/QuickMarcView', () => ({
  onClose,
  lastMenu,
}) => (
  <div>
    QuickMarcView

    <button
      type="button"
      onClick={onClose}
    >
      Close QuickMarcView
    </button>

    {lastMenu}
  </div>
));
