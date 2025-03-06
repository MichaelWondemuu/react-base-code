import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Select, Button, Box, Textarea } from '@mantine/core';

interface NodeFormProps {
  actionType: 'add' | 'edit';
  existingNode?: { name: string; description: string; type: 'institute' | 'school' | 'department' | 'teacher' } | null;
  onSubmit: (data: FormData) => void;
}

const nodeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(200, 'Description cannot exceed 200 characters'),
  type: z.enum(['institute', 'school', 'department', 'teacher']),
});

type FormData = z.infer<typeof nodeSchema>;

const NodeForm: React.FC<NodeFormProps> = ({ actionType, existingNode, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'teacher',
    },
  });

  useEffect(() => {
    if (actionType === 'edit' && existingNode) {
      setValue('name', existingNode.name);
      setValue('description', existingNode.description);
      setValue('type', existingNode.type);
    }
  }, [actionType, existingNode, setValue]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ padding: '16px' }}>
      <TextInput
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter node name"
      />
      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        mt="sm"
        placeholder="Enter node description"
      />

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            label="Type"
            data={[
              { value: 'institute', label: 'Institute' },
              { value: 'school', label: 'School' },
              { value: 'department', label: 'Department' },
              { value: 'teacher', label: 'Teacher' },
            ]}
            value={field.value}
            onChange={(value) => field.onChange(value || 'teacher')}
            error={errors.type?.message}
            mt="sm"
            placeholder="Select node type"
          />
        )}
      />

      <Button type="submit" mt="md">
        {actionType === 'add' ? 'Add Node' : 'Edit Node'}
      </Button>
    </Box>
  );
};

export default NodeForm;