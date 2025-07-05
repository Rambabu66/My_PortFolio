import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    // Use the semantic <footer> element
    <footer className='bg-dark text-light p-3 text-center'> 
       
        <p className="mb-0"> 
            &copy; {currentYear} Rambabu, All Rights Reserved
        </p>
    </footer>
  );
}

export default Footer;
