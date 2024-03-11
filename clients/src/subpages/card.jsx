import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function SmallCard({ title, buttonText, image }) {
  return (
    <Card style={{ minWidth: '12rem', width: '14rem', height: 'auto', margin: '1rem', overflow: 'hidden' }}>
      <Card.Img variant="top" src={image} style={{ width: '100%', height: '70%', objectFit: 'cover' }} />
      <Card.Body style={{ textAlign: 'center', height: '1px' }}>
        <Card.Title style={{ marginBottom: '0.5rem', height: '30px', fontSize: 'small'}}>{title}</Card.Title>
        <Button variant="primary" href="/show" style={{ width: '100%', fontSize: 'small', height:'30px' }}>{buttonText}</Button>
      </Card.Body>
    </Card>

  );
}


export default SmallCard;
