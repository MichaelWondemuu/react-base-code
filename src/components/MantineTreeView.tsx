import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { deleteNode, addNode, editNode } from '../store/hierarchySlice';
import { List, Button, Collapse, Modal, Group, Text, Box, ActionIcon } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import NodeForm from './AddEditForm';

// Function to convert flat data to hierarchical tree structure
const buildTree = (nodes: any[]) => {
  const nodeMap: { [key: number]: any } = {};
  const tree: any[] = [];

  nodes.forEach((node) => {
    nodeMap[node.id] = { ...node, children: [] };
  });

  nodes.forEach((node) => {
    if (node.parentId === null) {
      tree.push(nodeMap[node.id]);
    } else {
      nodeMap[node.parentId]?.children.push(nodeMap[node.id]);
    }
  });

  return tree;
};

const TreeView: React.FC = () => {
  const treeData = useSelector((state: RootState) => state.tree.nodes);
  const dispatch = useDispatch<AppDispatch>();

  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'add' | 'edit' | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [parentNodeId, setParentNodeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hierarchicalTreeData = useMemo(() => buildTree(treeData), [treeData]);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });
  };

  const handleAddNode = (parentId: number | null) => {
    setSelectedNode(null);
    setParentNodeId(parentId);
    setActionType('add');
    setIsModalOpen(true);
  };

  const handleEditNode = (node: any) => {
    setSelectedNode(node);
    setActionType('edit');
    setIsModalOpen(true);
  };

  const handleDeleteNode = (nodeId: number) => {
    dispatch(deleteNode(nodeId));
  };

  const handleFormSubmit = (data: any) => {
    if (actionType === 'add') {
      const newNode = { ...data, id: Date.now(), parentId: parentNodeId };
      dispatch(addNode(newNode));
    } else if (actionType === 'edit' && selectedNode) {
      dispatch(editNode({ ...selectedNode, ...data }));
    }
    setIsModalOpen(false);
  };

  const renderTree = (nodes: any[]) => {
    return nodes.map((node: any) => (
      <List.Item key={node.id}>
        <Group align="center">
          {node.children && node.children.length > 0 && (
            <ActionIcon onClick={() => toggleNode(node.id)}>
              {expandedNodes.has(node.id) ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />}
            </ActionIcon>
          )}
          <Text weight={500}>{node.name}</Text>
          <Group spacing={4}>
            <ActionIcon onClick={() => handleEditNode(node)} title="Edit Node" color="yellow">
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon onClick={() => handleDeleteNode(node.id)} title="Delete Node" color="red">
              <IconTrash size={16} />
            </ActionIcon>
            <ActionIcon onClick={() => handleAddNode(node.id)} title="Add Node" color="blue">
              <IconPlus size={16} />
            </ActionIcon>
          </Group>
        </Group>
        {node.children && node.children.length > 0 && (
          <Collapse in={expandedNodes.has(node.id)}>
            <List ml={20}>{renderTree(node.children)}</List>
          </Collapse>
        )}
      </List.Item>
    ));
  };

  return (
    <Box p="md">
      <Text size="xl" weight={700} mb="md">
        Tree View
      </Text>
      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title={actionType === 'add' ? 'Add Node' : 'Edit Node'}>
        {actionType && <NodeForm actionType={actionType} existingNode={selectedNode} onSubmit={handleFormSubmit} />}
      </Modal>
      <List spacing="xs">{renderTree(hierarchicalTreeData)}</List>
    </Box>
  );
};

export default TreeView;