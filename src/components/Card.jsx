import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const CardButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0069d9;
  }
`;

const Card = ({ title, text, buttonText, imageSrc, imageAlt }) => {
  return (
    <CardContainer>
      <CardImage src={imageSrc} alt={imageAlt} />
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardText>{text}</CardText>
        <CardButton>{buttonText}</CardButton>
      </CardContent>
    </CardContainer>
  );
};

export default Card;
