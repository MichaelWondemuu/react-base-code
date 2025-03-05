// NodeForm.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNode, editNode } from '../store/hierarchySlice';

interface FormData {
  name: string;
  description: string;
  type: 'institute' | 'school' | 'department' | 'teacher';
}

interface NodeFormProps {
  actionType: 'add' | 'edit'; // 'add' for adding, 'edit' for editing
  existingNode?: any;         // Only needed for editing
  onSubmit: (data: FormData) => void; // Submit handler
}

const NodeForm: React.FC<NodeFormProps> = ({ actionType, existingNode, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'teacher',
  });

  useEffect(() => {
    if (actionType === 'edit' && existingNode) {
      setFormData({
        name: existingNode.name,
        description: existingNode.description,
        type: existingNode.type,
      });
    }
  }, [actionType, existingNode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="institute">Institute</option>
          <option value="school">School</option>
          <option value="department">Department</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
        {actionType === 'add' ? 'Add Node' : 'Edit Node'}
      </button>
    </form>
  );
};

export default NodeForm;
