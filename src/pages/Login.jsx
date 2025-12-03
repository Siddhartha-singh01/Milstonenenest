import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Auth3D from '../components/Auth3D';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState(0);
    const [captchaInput, setCaptchaInput] = useState('');

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setCaptchaQuestion(`${num1} + ${num2}`);
        setCaptchaAnswer(num1 + num2);
        setCaptchaInput('');
    };

    const { login, signup, googleSignIn, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (mode === 'signup') {
            if (!formData.name.trim()) {
                newErrors.name = 'Name is required';
            }
            if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (parseInt(captchaInput) !== captchaAnswer) {
                newErrors.captcha = 'Incorrect CAPTCHA answer';
            }
        }

        if (!formData.email.includes('@')) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            if (mode === 'signup') {
                await signup(formData.email, formData.password);
                // Note: We might want to update the user's display name here or in the sync function
                navigate('/dashboard');
            } else {
                await login(formData.email, formData.password);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Auth failed', error);
            let errorMessage = 'Authentication failed';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await googleSignIn();
            navigate('/dashboard');
        } catch (error) {
            console.error('Google Sign In failed', error);
            setErrors({ general: 'Google Sign In failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setIsLoading(true);
        try {
            // For guest login, we might need a specific handling or just use a hardcoded guest account if it exists in Firebase
            // Or we can keep the mock behavior for guest if desired, but ideally we should have a guest auth flow.
            // For now, let's assume there's a guest account or disable it. 
            // Since the user wants Firebase, let's try to login with a known guest credential or just alert.
            // Better: Create an anonymous auth or just a specific guest user.
            // Let's use a specific guest user for now if created, or just alert.
            alert("Guest login is not fully configured with Firebase yet. Please use Google or Email/Password.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const toggleMode = () => {
        const newMode = mode === 'login' ? 'signup' : 'login';
        setMode(newMode);
        setErrors({});
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        if (newMode === 'signup') {
            generateCaptcha();
        }
    };

    return (
        <div style={{
            backgroundColor: '#FAFAFA',
            color: '#171717',
            minHeight: '100vh',
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 5%',
                maxWidth: '1400px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10
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

            {/* 3D Background */}
            <Auth3D />

            {/* Main Content */}
            <main style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 100px)',
                padding: '2rem 5%',
                position: 'relative',
                zIndex: 5
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '440px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '2rem',
                    padding: '3rem 2.5rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    position: 'relative'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            letterSpacing: '-0.03em',
                            marginBottom: '0.5rem'
                        }}>
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p style={{ color: '#737373', fontSize: '1rem' }}>
                            {mode === 'login'
                                ? 'Sign in to continue to Milestonenest'
                                : 'Start your journey with Milestonenest'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {errors.general && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            borderRadius: '0.75rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {errors.general}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Name Field (Signup only) */}
                        {mode === 'signup' && (
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#171717'
                                }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#A3A3A3'
                                    }} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            borderRadius: '0.75rem',
                                            border: `2px solid ${errors.name ? '#EF4444' : '#E5E5E5'}`,
                                            backgroundColor: 'white',
                                            color: '#171717',
                                            fontSize: '1rem',
                                            transition: 'border-color 0.2s',
                                            outline: 'none'
                                        }}
                                        placeholder="John Doe"
                                        onFocus={(e) => e.target.style.borderColor = '#171717'}
                                        onBlur={(e) => e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E5E5'}
                                    />
                                </div>
                                {errors.name && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#171717'
                            }}>
                                Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#A3A3A3'
                                }} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                        borderRadius: '0.75rem',
                                        border: `2px solid ${errors.email ? '#EF4444' : '#E5E5E5'}`,
                                        backgroundColor: 'white',
                                        color: '#171717',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    placeholder="you@example.com"
                                    onFocus={(e) => e.target.style.borderColor = '#171717'}
                                    onBlur={(e) => e.target.style.borderColor = errors.email ? '#EF4444' : '#E5E5E5'}
                                />
                            </div>
                            {errors.email && (
                                <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#171717'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#A3A3A3'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 3rem 0.875rem 3rem',
                                        borderRadius: '0.75rem',
                                        border: `2px solid ${errors.password ? '#EF4444' : '#E5E5E5'}`,
                                        backgroundColor: 'white',
                                        color: '#171717',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    placeholder="••••••••"
                                    onFocus={(e) => e.target.style.borderColor = '#171717'}
                                    onBlur={(e) => e.target.style.borderColor = errors.password ? '#EF4444' : '#E5E5E5'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#A3A3A3',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field (Signup only) */}
                        {mode === 'signup' && (
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#171717'
                                }}>
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#A3A3A3'
                                    }} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 3rem 0.875rem 3rem',
                                            borderRadius: '0.75rem',
                                            border: `2px solid ${errors.confirmPassword ? '#EF4444' : '#E5E5E5'}`,
                                            backgroundColor: 'white',
                                            color: '#171717',
                                            fontSize: '1rem',
                                            transition: 'border-color 0.2s',
                                            outline: 'none'
                                        }}
                                        placeholder="••••••••"
                                        onFocus={(e) => e.target.style.borderColor = '#171717'}
                                        onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#EF4444' : '#E5E5E5'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#A3A3A3',
                                            padding: 0
                                        }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* CAPTCHA Field (Signup only) */}
                        {mode === 'signup' && (
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#171717'
                                }}>
                                    Security Check: What is {captchaQuestion}?
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <ShieldCheck size={18} style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#A3A3A3'
                                    }} />
                                    <input
                                        type="number"
                                        value={captchaInput}
                                        onChange={(e) => {
                                            setCaptchaInput(e.target.value);
                                            if (errors.captcha) {
                                                setErrors({ ...errors, captcha: '' });
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            borderRadius: '0.75rem',
                                            border: `2px solid ${errors.captcha ? '#EF4444' : '#E5E5E5'}`,
                                            backgroundColor: 'white',
                                            color: '#171717',
                                            fontSize: '1rem',
                                            transition: 'border-color 0.2s',
                                            outline: 'none'
                                        }}
                                        placeholder="Enter answer"
                                        onFocus={(e) => e.target.style.borderColor = '#171717'}
                                        onBlur={(e) => e.target.style.borderColor = errors.captcha ? '#EF4444' : '#E5E5E5'}
                                    />
                                </div>
                                {errors.captcha && (
                                    <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                        {errors.captcha}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                backgroundColor: '#171717',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '1rem',
                                marginTop: '0.5rem',
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                border: 'none'
                            }}
                            onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {isLoading
                                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                                : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            style={{
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                backgroundColor: 'white',
                                border: '2px solid #E5E5E5',
                                color: '#171717',
                                fontWeight: '500',
                                fontSize: '1rem',
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem'
                            }}
                            onMouseEnter={(e) => !isLoading && (e.target.style.borderColor = '#171717')}
                            onMouseLeave={(e) => e.target.style.borderColor = '#E5E5E5'}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                            Sign in with Google
                        </button>

                        {/* Divider */}
                        {mode === 'login' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E5E5' }} />
                                    <span style={{ color: '#A3A3A3', fontSize: '0.875rem' }}>OR</span>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E5E5' }} />
                                </div>

                                {/* Guest Login */}
                                <button
                                    type="button"
                                    onClick={handleGuestLogin}
                                    disabled={isLoading}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'white',
                                        border: '2px solid #E5E5E5',
                                        color: '#171717',
                                        fontWeight: '500',
                                        fontSize: '1rem',
                                        opacity: isLoading ? 0.7 : 1,
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => !isLoading && (e.target.style.borderColor = '#171717')}
                                    onMouseLeave={(e) => e.target.style.borderColor = '#E5E5E5'}
                                >
                                    Continue as Guest
                                </button>
                            </>
                        )}
                    </form>

                    {/* Toggle Mode */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid #E5E5E5'
                    }}>
                        <p style={{ color: '#737373', fontSize: '0.9rem' }}>
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={toggleMode}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#171717',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: 0,
                                    fontSize: '0.9rem'
                                }}
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
