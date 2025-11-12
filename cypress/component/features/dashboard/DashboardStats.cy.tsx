import { DashboardStats } from '../../../../src/features/dashboard/components/DashboardStats';

describe('DashboardStats - Dashboard Feature', () => {
  const mockStats = [
    { label: 'Total Users', value: '1,234', change: '+12%', trend: 'up' as const },
    { label: 'Revenue', value: '$45,678', change: '+8%', trend: 'up' as const },
    { label: 'Active Sessions', value: 567, change: '-3%', trend: 'down' as const },
    { label: 'Conversion Rate', value: '23.5%' },
  ];

  it('renders with stats data', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.contains('Dashboard Statistics').should('exist');
  });

  it('displays all stat cards', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.get('.grid > div').should('have.length', 4);
  });

  it('shows stat labels correctly', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.contains('Total Users').should('exist');
    cy.contains('Revenue').should('exist');
    cy.contains('Active Sessions').should('exist');
    cy.contains('Conversion Rate').should('exist');
  });

  it('shows stat values correctly', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.contains('1,234').should('exist');
    cy.contains('$45,678').should('exist');
    cy.contains('567').should('exist');
    cy.contains('23.5%').should('exist');
  });

  it('shows change indicators when provided', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.contains('+12%').should('exist');
    cy.contains('+8%').should('exist');
    cy.contains('-3%').should('exist');
  });

  it('applies correct trend colors', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.contains('+12%').should('have.class', 'text-green-600');
    cy.contains('-3%').should('have.class', 'text-red-600');
  });

  it('renders refresh button when onRefresh is provided', () => {
    const onRefresh = cy.stub().as('refreshHandler');
    cy.mount(<DashboardStats stats={mockStats} onRefresh={onRefresh} />);
    cy.contains('button', 'Refresh').should('exist');
  });

  it('does not render refresh button when onRefresh is not provided', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.contains('button', 'Refresh').should('not.exist');
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = cy.stub().as('refreshHandler');
    cy.mount(<DashboardStats stats={mockStats} onRefresh={onRefresh} />);
    cy.contains('button', 'Refresh').click();
    cy.get('@refreshHandler').should('have.been.calledOnce');
  });

  it('handles empty stats array', () => {
    cy.mount(<DashboardStats stats={[]} />);
    cy.contains('Dashboard Statistics').should('exist');
    cy.get('.grid > div').should('have.length', 0);
  });

  it('handles stats without change or trend', () => {
    const statsWithoutChange = [
      { label: 'Static Value', value: '100' },
    ];
    cy.mount(<DashboardStats stats={statsWithoutChange} />);
    cy.contains('Static Value').should('exist');
    cy.contains('100').should('exist');
  });

  it('has responsive grid layout classes', () => {
    cy.mount(<DashboardStats stats={mockStats} />);
    cy.get('.grid').should('have.class', 'grid-cols-1');
    cy.get('.grid').should('have.class', 'md:grid-cols-2');
    cy.get('.grid').should('have.class', 'lg:grid-cols-4');
  });
});
