import { ProfileCard } from '../../../../src/features/profile/components/ProfileCard';

describe('ProfileCard - Profile Feature', () => {
  const mockProps = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Software developer and tech enthusiast.',
  };

  it('renders with required props', () => {
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} />);
    cy.contains(mockProps.name).should('exist');
    cy.contains(mockProps.email).should('exist');
  });

  it('displays user name correctly', () => {
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} />);
    cy.get('h3').should('contain', 'John Doe');
  });

  it('displays user email correctly', () => {
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} />);
    cy.contains(mockProps.email).should('have.class', 'text-sm');
  });

  it('displays avatar image when avatar prop is provided', () => {
    cy.mount(<ProfileCard {...mockProps} />);
    cy.get('img').should('have.attr', 'src', mockProps.avatar);
    cy.get('img').should('have.attr', 'alt', mockProps.name);
  });

  it('displays initial letter when no avatar is provided', () => {
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} />);
    cy.get('span').contains('J').should('exist');
  });

  it('displays bio when provided', () => {
    cy.mount(<ProfileCard {...mockProps} />);
    cy.contains(mockProps.bio).should('exist');
  });

  it('does not display bio when not provided', () => {
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} />);
    cy.contains('Software developer').should('not.exist');
  });

  it('renders edit button when onEdit is provided', () => {
    const onEdit = cy.stub().as('editHandler');
    cy.mount(<ProfileCard {...mockProps} onEdit={onEdit} />);
    cy.contains('button', 'Edit Profile').should('exist');
  });

  it('does not render edit button when onEdit is not provided', () => {
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} />);
    cy.contains('button', 'Edit Profile').should('not.exist');
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = cy.stub().as('editHandler');
    cy.mount(<ProfileCard {...mockProps} onEdit={onEdit} />);
    cy.contains('button', 'Edit Profile').click();
    cy.get('@editHandler').should('have.been.calledOnce');
  });

  it('capitalizes first letter of name for avatar placeholder', () => {
    cy.mount(<ProfileCard name="alice" email="alice@example.com" />);
    cy.get('span').contains('A').should('exist');
  });

  it('has correct styling classes', () => {
    cy.mount(<ProfileCard {...mockProps} />);
    cy.get('.p-6').should('exist');
    cy.get('.border').should('exist');
    cy.get('.rounded-lg').should('exist');
  });

  it('handles long names gracefully', () => {
    cy.mount(
      <ProfileCard
        name="Very Long Name That Might Overflow The Container"
        email={mockProps.email}
      />
    );
    cy.contains('Very Long Name').should('exist');
  });

  it('handles long bio text', () => {
    const longBio = 'This is a very long bio that contains a lot of text and might need to wrap to multiple lines to display properly in the card component.';
    cy.mount(<ProfileCard name={mockProps.name} email={mockProps.email} bio={longBio} />);
    cy.contains(longBio).should('exist');
  });

  it('has responsive max-width', () => {
    cy.mount(<ProfileCard {...mockProps} />);
    cy.get('.max-w-md').should('exist');
  });
});
