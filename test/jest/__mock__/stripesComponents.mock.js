jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: ({ children, icon }) => (children || <span>{icon}</span>),
  LoadingView: () => <div>Loading view</div>,
}));
