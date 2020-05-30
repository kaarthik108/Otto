import React from 'react';
import 'App.css';
import { Row } from 'react-bootstrap';

function RightColumnContainer() {
    return (
        <>
            <Row className='outerContainer toolboxContainer'>Toolbox</Row>
            <Row className='outerContainer ottoContainer'>Otto bot</Row>
        </>
    );
}

export default RightColumnContainer;