import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm';
import { act } from 'react-dom/test-utils';

test('Contact form renders without crashing', () => {
    render(<ContactForm />);
});

test('Contains input for first name', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Edd');
});

test('Contains input for last name', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Burke');
});

test('Contains input for email', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText("bluebill1049@hotmail.com");
});

test('Contains textarea for a message', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Write a message...');
});

test('Form submits records and submits information correctly', async () => {
    const { getByPlaceholderText, getByRole, getByTestId } = render(<ContactForm />);

    //get inputs
    const firstInput = getByPlaceholderText('Edd');
    const secondInput = getByPlaceholderText('Burke');
    const emailInput = getByPlaceholderText("bluebill1049@hotmail.com");
    const messageTextArea = getByPlaceholderText('Write a message...');
    const submitButton = getByRole('button');

    //make values
    const firstName = 'Vincent';
    const lastName = 'Sanders';
    const email = 'a@b.com';
    const message = 'Here is a test message.';

    //type values into inputs
    await act( async () => {
        await userEvent.type(firstInput, firstName);
        await userEvent.type(secondInput, lastName);
        await userEvent.type(emailInput, email);
        await userEvent.type(messageTextArea, message);
        submitButton.click();
    });

    //data will be displayed, so get pre element that displays data
    const displayedData = getByTestId(/^data-json-stringified$/);

    //make sure displayed data matches what was input.
    const expected = `{
  "firstName": "${firstName}",
  "lastName": "${lastName}",
  "email": "${email}",
  "message": "${message}"
}`;

    expect(displayedData.textContent).toBe(expected);
});

test('Required fields display error after touched if no text was entered', async () => {
    const { findAllByText, getByRole } = render(<ContactForm />);

    const submitButton = getByRole('button');

    //Clicking the submit button will cause all empty 
    //required inputs to display an error.
    submitButton.click();

    //errors should display now
    const errors = await findAllByText('Looks like there was an error: required');
    
    //If all errors displayed correctly, there should be 3.
    expect(errors.length).toBe(3);
});

test('First name input throws error if a name under 3 characters is typed', async () => {
    const { getByRole, getByPlaceholderText, findByText } = render(<ContactForm />);

    const firstInput = getByPlaceholderText('Edd');
    const submitButton = getByRole('button');

    await act(async () => {
        await userEvent.type(firstInput, "vi");
        submitButton.click();
    })

    await findByText('Looks like there was an error: minLength');
});