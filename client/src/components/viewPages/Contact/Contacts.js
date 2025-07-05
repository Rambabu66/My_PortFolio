// src/components/viewPages/Contact/Contacts.js
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
// Removed ToastContainer import
import { toast } from 'react-toastify'; // Keep toast import
// Removed 'react-toastify/dist/ReactToastify.css' import (it's now in NotificationContainer.js)

const Contacts = () => {
    const form = useRef();
    const [isSending, setIsSending] = useState(false);

    // --- Configuration (Consider Environment Variables) ---
    const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_pziu264';
    const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_arn3quh';
    const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'O1u-6zwtZf_Q2oWR2';

    const sendEmail = (e) => {
        e.preventDefault();
        if (!form.current) return;

        // Basic validation example (optional but recommended)
        const formData = new FormData(form.current);
        const name = formData.get('user_name');
        const email = formData.get('user_email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            toast.warn('Please fill in Name, Email, and Message fields.');
            return;
        }

        setIsSending(true);
        const data = Object.fromEntries(formData.entries());
        console.log('Sending email with data:', data);

        emailjs
            .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, {
                publicKey: EMAILJS_PUBLIC_KEY,
            })
            .then(
                (result) => {
                    console.log('SUCCESS!', result.text);
                    toast.success('Your message has been sent successfully!');
                    form.current.reset();
                },
                (error) => {
                    console.error('FAILED...', error);
                    const errorText = error.text || 'An unknown error occurred.';
                    toast.error(`Failed to send message: ${errorText}`);
                }
            )
            .finally(() => {
                // Ensure isSending is set to false regardless of success or failure
                setIsSending(false);
            });
    };

    return (
        <Container className='contact-section py-4 mt-5'>
            {/* ToastContainer is removed from here */}
             <h2 className="text-center m-4">Contact Us</h2>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Form ref={form} onSubmit={sendEmail} className="shadow-sm p-4 bg-dark text-white rounded">
                        {/* --- Form Fields --- */}
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="user_name" // Ensure this matches your EmailJS template
                                placeholder="Enter your name"
                                disabled={isSending}
                                // Removed required prop if using manual validation + toast
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="user_email" // Ensure this matches your EmailJS template
                                placeholder="Enter your email"
                                disabled={isSending}
                                // Removed required prop
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSubject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject" // Ensure this matches your EmailJS template
                                placeholder="Enter your subject"
                                disabled={isSending}
                                // Subject might not always be required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="message" // Ensure this matches your EmailJS template
                                placeholder="Your message"
                                disabled={isSending}
                                // Removed required prop
                            />
                        </Form.Group>
                        {/* --- End Form Fields --- */}

                        <div className="text-center">
                            <Button variant="primary" type="submit" disabled={isSending}>
                                {isSending ? 'Sending...' : 'Send Message'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Contacts;
