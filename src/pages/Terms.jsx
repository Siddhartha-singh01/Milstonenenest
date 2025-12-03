import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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
                    Terms of Service
                </h1>
                <p style={{ color: '#737373', fontSize: '1rem', marginBottom: '3rem' }}>
                    Last updated: November 21, 2025
                </p>

                <div style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Agreement to Terms
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            By accessing or using Milestonenest, you agree to be bound by these Terms of Service and all
                            applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                            from using or accessing this service.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Use License
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            Permission is granted to temporarily use Milestonenest for personal or commercial project management
                            purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul style={{ color: '#525252', paddingLeft: '2rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Modify or copy the materials</li>
                            <li style={{ marginBottom: '0.5rem' }}>Use the materials for any commercial purpose without proper licensing</li>
                            <li style={{ marginBottom: '0.5rem' }}>Attempt to decompile or reverse engineer any software contained in Milestonenest</li>
                            <li style={{ marginBottom: '0.5rem' }}>Remove any copyright or other proprietary notations from the materials</li>
                            <li style={{ marginBottom: '0.5rem' }}>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            User Accounts
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            When you create an account with us, you must provide accurate, complete, and current information.
                            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
                            your account.
                        </p>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            You are responsible for safeguarding the password that you use to access the service and for any
                            activities or actions under your password. You agree not to disclose your password to any third party.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Acceptable Use
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            You agree not to use Milestonenest:
                        </p>
                        <ul style={{ color: '#525252', paddingLeft: '2rem', marginBottom: '1rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>In any way that violates any applicable national or international law or regulation</li>
                            <li style={{ marginBottom: '0.5rem' }}>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                            <li style={{ marginBottom: '0.5rem' }}>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                            <li style={{ marginBottom: '0.5rem' }}>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                            <li style={{ marginBottom: '0.5rem' }}>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Intellectual Property
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            The service and its original content, features, and functionality are and will remain the exclusive
                            property of Milestonenest Inc. and its licensors. The service is protected by copyright, trademark,
                            and other laws of both the United States and foreign countries.
                        </p>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            Our trademarks and trade dress may not be used in connection with any product or service without
                            the prior written consent of Milestonenest Inc.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Termination
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any
                            reason whatsoever, including without limitation if you breach the Terms. Upon termination, your
                            right to use the service will immediately cease.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Limitation of Liability
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            In no event shall Milestonenest Inc., nor its directors, employees, partners, agents, suppliers,
                            or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                            including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                            resulting from your access to or use of or inability to access or use the service.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Disclaimer
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE"
                            basis. The service is provided without warranties of any kind, whether express or implied, including,
                            but not limited to, implied warranties of merchantability, fitness for a particular purpose,
                            non-infringement or course of performance.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Changes to Terms
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                            If a revision is material, we will try to provide at least 30 days' notice prior to any new terms
                            taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            Contact Us
                        </h2>
                        <p style={{ color: '#525252', marginBottom: '1rem' }}>
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p style={{ color: '#525252' }}>
                            Email: <a href="mailto:legal@milestonenest.com" style={{ color: '#171717', textDecoration: 'underline' }}>
                                legal@milestonenest.com
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

export default Terms;
