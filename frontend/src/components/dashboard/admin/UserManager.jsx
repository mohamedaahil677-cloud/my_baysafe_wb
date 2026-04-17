import React from 'react';
import { User, Trash2 } from 'lucide-react';
import VisualDataTable from './VisualDataTable';
import { adminService } from '../../../services/api';

const UserManager = ({ users = [], onUpdate, isTamil }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Delete this user account permanently?')) {
            try {
                await adminService.deleteUser(id);
                onUpdate();
            } catch (error) {
                alert("Failed to delete user");
            }
        }
    };

    const columns = [
        { key: 'id', label: 'ID', labelT: 'ID' },
        { key: 'username', label: 'Username', labelT: 'பயனர் பெயர்' },
        { key: 'role', label: 'Global Role', labelT: 'பங்கு', type: 'status' },
        { key: 'city', label: 'Region', labelT: 'மண்டலம்' },
        { key: 'is_verified', label: 'Verified', labelT: 'சரிபார்க்கப்பட்டது' },
    ];

    const mappedData = users.map(u => ({
        ...u,
        role: u.role.toUpperCase(),
        is_verified: u.is_verified ? 'ACTIVE' : 'OFFLINE'
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <VisualDataTable 
                title={isTamil ? "பயனர் டைரக்டரி" : "Global User Directory"}
                columns={columns}
                data={mappedData}
                isTamil={isTamil}
            />
        </div>
    );
};

export default UserManager;
