import React, { useState } from 'react';
import { List, Trash2, CheckCircle, Clock, MapPin, User, ChevronDown } from 'lucide-react';
import VisualDataTable from './VisualDataTable';
import { adminService } from '../../../services/api';

const TaskManager = ({ tasks = [], onUpdateTasks, isTamil }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Confirm deletion of this task/SOS?')) {
            try {
                await adminService.deleteTask(id);
                onUpdateTasks();
            } catch (error) {
                alert("Failed to delete task");
            }
        }
    };

    const columns = [
        { key: 'id', label: 'ID', labelT: 'ID' },
        { key: 'title', label: 'Title', labelT: 'தலைப்பு' },
        { key: 'city', label: 'Region', labelT: 'மண்டலம்' },
        { key: 'posted_by', label: 'Requested By', labelT: 'கோரியவர்' },
        { key: 'urgency', label: 'Urgency', labelT: 'அவசரம்', type: 'status' },
        { key: 'status', label: 'Current Status', labelT: 'நிலை', type: 'status' },
    ];

    const mappedData = tasks.map(t => ({
        ...t,
        urgency: t.urgency.toUpperCase(),
        status: t.status.toUpperCase()
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <VisualDataTable 
                title={isTamil ? "அவசரக்கால பணி மேலாண்மை" : "Emergency Task Command Hub"}
                columns={columns}
                data={mappedData}
                isTamil={isTamil}
            />
        </div>
    );
};

export default TaskManager;
