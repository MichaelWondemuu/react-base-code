import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Select, Button, Box, Textarea, Text, Alert, Loader, Group, Modal } from '@mantine/core';

// Zod schema validation for node form
const nodeSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters').max(200, 'Description cannot exceed 200 characters'),
    type: z.enum(['institute', 'school', 'department', 'teacher']),
});

type FormData = z.infer<typeof nodeSchema>;

interface NodeFormProps {
    actionType: 'add' | 'edit';
    existingNode?: FormData | null;
    onSubmit: (data: FormData) => void;
    isLoading?: boolean; // Optional loading state prop for submit
    errorMessage?: string; // Optional error message for handling failed submit
    isOpen: boolean; // Modal open state
    onClose: () => void; // Function to close the modal
  }

const NodeForm: React.FC<NodeFormProps> = ({ actionType, existingNode, onSubmit, isLoading = false, errorMessage, isOpen, onClose }) => {
    // Use React Hook Form for form handling with Zod validation
    const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormData>({
        resolver: zodResolver(nodeSchema),
        // Default valid values for the 'add' action
        defaultValues: actionType === 'edit' && existingNode ? existingNode : { 
            name: '', 
            description: '', 
            type: 'teacher' 
        },
        mode: 'onChange', // Trigger validation on change
    });

    // Reset the form when `existingNode` changes (edit mode)
    useEffect(() => {
        if (existingNode) {
            reset(existingNode); // Set the form values with the existing node data
        } else {
            reset({
                name: '', // Provide a default valid name
                description: '', // Provide a default valid description
                type: 'teacher',
            });
        }
    }, [existingNode, reset]);

    return (
        <Modal opened={isOpen} onClose={onClose} title={actionType === 'add' ? 'Add Node' : 'Edit Node'}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {/* Error Message Alert */}
                {errorMessage && (
                    <Alert color="red" mb="sm">
                        {errorMessage}
                    </Alert>
                )}

                {/* Name input field */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label="Name"
                            {...field}
                            error={errors.name?.message}
                            placeholder="Enter node name"
                        />
                    )}
                />
                {errors.name?.message && <Text color="red" size="sm">{errors.name.message}</Text>}

                {/* Description input field */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label="Description"
                            {...field}
                            error={errors.description?.message}
                            mt="sm"
                            placeholder="Enter node description"
                        />
                    )}
                />
                {errors.description?.message && <Text color="red" size="sm">{errors.description.message}</Text>}

                {/* Type input field */}
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Type"
                            data={[
                                { value: 'institute', label: 'Institute' },
                                { value: 'school', label: 'School' },
                                { value: 'department', label: 'Department' },
                                { value: 'teacher', label: 'Teacher' },
                            ]}
                            {...field}
                            error={errors.type?.message}
                            mt="sm"
                            placeholder="Select node type"
                        />
                    )}
                />
                {errors.type?.message && <Text color="red" size="sm">{errors.type.message}</Text>}

                {/* Submit button */}
                <Group position="center" mt="md">
                    <Button
                        type="submit"
                        disabled={!isValid || isLoading}  // Disable button if form is not valid or loading
                        leftIcon={isLoading ? <Loader size="xs" /> : null}
                        color={actionType === 'add' ? 'green' : 'blue'} // Green for Add, Blue for Edit
                    >
                        {actionType === 'add' ? 'Add Node' : 'Edit Node'}
                    </Button>
                </Group>
            </Box>
        </Modal>
    );
};

export default NodeForm;
