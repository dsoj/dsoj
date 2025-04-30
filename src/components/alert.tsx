"use client";
import { useRef } from 'react';
import { Overlay, Alert } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';


export default function AlertMessage({ show, text, varient }: { text: string, show: boolean, varient?: Variant; }) {
    const target = useRef(null);

    return (
        <Overlay target={target.current} show={show} placement="right">
            {(props) => (
                <Alert style={{ maxWidth: '10em', marginLeft: '1em' }} key={(varient) ? varient : 'success'} variant={(varient) ? varient : 'success'} className="fixed-bottom">
                    {text}
                </Alert>
            )}
        </Overlay>
    );

}