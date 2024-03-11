import React from 'react';
import '../styles/Footer.css'; // Make sure to create a corresponding Footer.css file

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-description">
                    <h3>MovieAssassin Theaters</h3>
                    <ul style={{listStyle: 'none'}}>
                        <li> All Right Reserve: APIAssassins </li>
                        <li> contact: 123456789</li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/promotions">Promotions</a></li>
                        <li><a href="/membership">Membership</a></li>
                        <li><a href="/contact-us">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
