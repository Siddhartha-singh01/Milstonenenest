import { useState } from 'react';
import { Plus } from 'lucide-react';
import MilestoneList from '../components/MilestoneList';
import MilestoneModal from '../components/MilestoneModal';
import ThreeBackground from '../components/ThreeBackground';
import { useTheme } from '../context/ThemeContext';

const Milestones = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [milestoneToEdit, setMilestoneToEdit] = useState(null);
    const { isDarkMode } = useTheme();

    const handleEdit = (milestone) => {
        setMilestoneToEdit(milestone);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setMilestoneToEdit(null);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <ThreeBackground />

            <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: isDarkMode ? '#F5F5F5' : '#171717' }}>Milestones</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: isDarkMode ? '#6366f1' : 'var(--color-primary)',
                            color: 'white',
                            padding: '0.75rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 500,
                            width: window.innerWidth < 640 ? '100%' : 'auto',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={20} />
                        New Milestone
                    </button>
                </div>

                <MilestoneList onEdit={handleEdit} />

                {isModalOpen && (
                    <MilestoneModal onClose={handleClose} milestoneToEdit={milestoneToEdit} />
                )}
            </div>
        </div>
    );
};

export default Milestones;
