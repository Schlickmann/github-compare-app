import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styles';

const Message = ({ repositoryError, repositoryMessage }) => (
  <Container repositoryError={repositoryError} repositoryMessage={repositoryMessage}>
    {repositoryMessage}
  </Container>
);

Message.propTypes = {
  repositoryError: PropTypes.bool.isRequired,
  repositoryMessage: PropTypes.string.isRequired,
};

export default Message;
