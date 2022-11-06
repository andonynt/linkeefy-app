import styled from 'styled-components';

const Button = styled.button`
  text-transform: capitalize;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  background-color: ${(props) => props.background};
  color: ${(props) => (props.background === '#ccc' ? '#000' : '#FFF')};
  font-weight: 600;
`;

export default Button;
