import { useState } from 'react';
import { X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';

const MilestoneModal = ({ onClose, milestoneToEdit = null }) => {
    const { addMilestone, updateMilestone } = useProject();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState(milestoneToEdit || {
        title: '',
        description: '',
        dueDate: '',
        status: 'active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (milestoneToEdit) {
            updateMilestone(milestoneToEdit.id, formData);
        } else {
            addMilestone(formData);
        }
        onClose();
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
        backgroundColor: isDarkMode ? '#171717' : 'white',
        color: isDarkMode ? '#F5F5F5' : '#171717',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        color: isDarkMode ? '#D4D4D4' : '#374151'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: isDarkMode ? '#262626' : 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '500px',
                border: isDarkMode ? '1px solid #404040' : '1px solid #E5E5E5',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isDarkMode ? '#F5F5F5' : '#171717' }}>{milestoneToEdit ? 'Edit Milestone' : 'New Milestone'}</h2>
                    <button onClick={onClose} style={{ color: isDarkMode ? '#A3A3A3' : '#737373', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                color: isDarkMode ? '#A3A3A3' : 'var(--color-text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isDarkMode ? '#6366f1' : 'var(--color-primary)',
                                color: 'white',
                                fontWeight: 500,
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {milestoneToEdit ? 'Save Changes' : 'Create Milestone'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MilestoneModal;
