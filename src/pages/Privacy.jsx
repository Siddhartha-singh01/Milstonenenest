import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
    return (
        <div style={{
            backgroundColor: '#FAFAFA',
            color: '#171717',
            minHeight: '100vh',
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            lineHeight: 1.6
        }}>
            {/* Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 5%',
                maxWidth: '1400px',
                margin: '0 auto',
                borderBottom: '1px solid #E5E5E5'
            }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.03em' }}>
                    Milestonenest.
                </div>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#525252',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    transition: 'color 0.2s'
                }}>
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
            </nav>

            {/* Content */}
            <main style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '4rem 5%'
            }}>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: '800',
                    letterSpacing: '-0.04em',
                    marginBottom: '1rem'
                }}>
                    Privacy Policy
                </h1>
                <p style={{ color: '#737373', fontSize: '1rem', marginBottom: '3rem' }}>
                    Last updated: November 21, 2025
                </p>

                <div style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Introduction
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            Welcome to Milestonenest. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you about how we look after your personal data when you visit our
                            website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Information We Collect
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            We may collect, use, store and transfer different kinds of personal data about you:
                        </p>
                        <ul style={{ color: '#525252', paddingLeft: '2rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>Identity Data:</strong> includes first name, last name, username or similar identifier.
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>Contact Data:</strong> includes email address and telephone numbers.
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version,
                                time zone setting and location, browser plug-in types and versions, operating system and platform.
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>Usage Data:</strong> includes information about how you use our website and services.
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <strong>Profile Data:</strong> includes your username and password, your interests, preferences,
                                feedback and survey responses.
                            </li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            How We Use Your Information
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your
                            personal data in the following circumstances:
                        </p>
                        <ul style={{ color: '#525252', paddingLeft: '2rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>To provide and maintain our service</li>
                            <li style={{ marginBottom: '0.5rem' }}>To notify you about changes to our service</li>
                            <li style={{ marginBottom: '0.5rem' }}>To provide customer support</li>
                            <li style={{ marginBottom: '0.5rem' }}>To gather analysis or valuable information to improve our service</li>
                            <li style={{ marginBottom: '0.5rem' }}>To monitor the usage of our service</li>
                            <li style={{ marginBottom: '0.5rem' }}>To detect, prevent and address technical issues</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Data Security
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            We have put in place appropriate security measures to prevent your personal data from being
                            accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We use industry-standard
                            encryption and security protocols to protect your data.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Your Rights
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data:
                        </p>
                        <ul style={{ color: '#525252', paddingLeft: '2rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Request access to your personal data</li>
                            <li style={{ marginBottom: '0.5rem' }}>Request correction of your personal data</li>
                            <li style={{ marginBottom: '0.5rem' }}>Request erasure of your personal data</li>
                            <li style={{ marginBottom: '0.5rem' }}>Object to processing of your personal data</li>
                            <li style={{ marginBottom: '0.5rem' }}>Request restriction of processing your personal data</li>
                            <li style={{ marginBottom: '0.5rem' }}>Request transfer of your personal data</li>
                            <li style={{ marginBottom: '0.5rem' }}>Right to withdraw consent</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Cookies
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            We use cookies and similar tracking technologies to track activity on our service and hold certain
                            information. Cookies are files with small amounts of data which may include an anonymous unique identifier.
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Contact Us
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p style={{ color: '#525252' }}>
                            Email: <a href="mailto:privacy@milestonenest.com" style={{ color: '#171717', textDecoration: 'underline' }}>
                                privacy@milestonenest.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                padding: '4rem 5%',
                borderTop: '1px solid #E5E5E5',
                marginTop: '4rem'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>Milestonenest.</div>
                    <div style={{ color: '#A3A3A3', fontSize: '0.9rem' }}>
                        &copy; 2025 Milestonenest Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Privacy;
