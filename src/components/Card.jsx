import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 6;
  max-width: 500px;
  margin: 0 auto;
  justify-self: center;

  @media (min-width: 1200px) {
    margin: 2rem; // Increase margin for larger screens
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%; // Adjust the height to fill the container
  object-fit: cover;
`;

const CardTitle = styled.h2`
  font-size: calc(2vw + 2rem); /* Adjust the font size */
  position: absolute;
  top: 10%; /* Adjust the position from the top */
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  z-index: 2;
  text-align: center;
  text-shadow: 2px 2px 4px #000000;
`;

const Card = ({ title, imageSrc, imageAlt }) => {
  return (
    <CardContainer>
      <CardImage src={imageSrc} alt={imageAlt} />
      <CardTitle>{title}</CardTitle>
    </CardContainer>
  );
};

export default Card;
