import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { deleteNode, addNode, editNode } from '../store/hierarchySlice';
import { List,Button,Collapse} from '@mantine/core';
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
  const [actionType, setActionType] = useState<'add' | 'edit' | null>(null); // Can be null initially
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [parentNodeId, setParentNodeId] = useState<number | null>(null);

  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert the flat tree data into a hierarchical tree structure
  const hierarchicalTreeData = useMemo(() => buildTree(treeData), [treeData]);

  // Function to toggle the expansion/collapse of nodes
  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId); // Collapse the node
      } else {
        newExpanded.add(nodeId); // Expand the node
      }
      return newExpanded;
    });
  };

  const handleAddNode = (parentId: number | null) => {
    setSelectedNode(null);
    setParentNodeId(parentId);  // Set the parentId for the new node
    setActionType('add');
    setIsModalOpen(true); // Open the modal
  };

  const handleEditNode = (node: any) => {
    setSelectedNode(node);
    setActionType('edit');
    setIsModalOpen(true); // Open the modal
  };

  const handleDeleteNode = (nodeId: number) => {
    dispatch(deleteNode(nodeId));
  };

  // Handle form submission after adding/editing a node
  const handleFormSubmit = (data: any) => {
    if (actionType === 'add') {
      const newNode = { ...data, id: Date.now(), parentId: parentNodeId };  // Parent ID set dynamically
      dispatch(addNode(newNode));
    } else if (actionType === 'edit' && selectedNode) {
      dispatch(editNode({ ...selectedNode, ...data }));
    }

    // Close the modal after submission
    setIsModalOpen(false);
  };

  // Render the tree nodes recursively
  const renderTree = (nodes: any[]) => {
    return nodes.map((node: any) => (
      <li key={node.id} className="ml-4 mb-4 list-none">
        <div className="flex items-center space-x-2">
          {/* Render the [+] / [-] button if the node has children */}
          {node.children && node.children.length > 0 && (
            <span
              className="cursor-pointer text-xl"
              onClick={() => toggleNode(node.id)} // Handle expand/collapse click
            >
              {expandedNodes.has(node.id) ? '[-]' : '[+]'}
            </span>
          )}
          <strong className="font-semibold text-lg">{node.name}</strong>
          {/* Edit Node Button (Symbol: Pencil) */}
          <button
            onClick={() => handleEditNode(node)}
            className="ml-2 p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
            title="Edit Node"
          >
            ✏️
          </button>
          {/* Delete Node Button (Symbol: Trash can) */}
          <button
            onClick={() => handleDeleteNode(node.id)}
            className="ml-2 p-2 bg-red-400 text-white rounded hover:bg-red-500 transition"
            title="Delete Node"
          >
            🗑️
          </button>
          {/* Add Node Button (Symbol: Plus sign) */}
          <button
            onClick={() => handleAddNode(node.id)} // Set parent ID to the clicked node's ID
            className="ml-2 p-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
            title="Add Node"
          >
            ➕
          </button>
        </div>

        {/* Render children if the node is expanded */}
        {node.children && node.children.length > 0 && expandedNodes.has(node.id) && (
          <ul className="ml-6 mt-2">{renderTree(node.children)}</ul>
        )}
      </li>
    ));
  };

  // Modal Component for the form
  const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen || actionType === null) return null; // Only render the modal if actionType is not null

    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()} // Prevent click event from closing modal
        >
          <button
            className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded"
            onClick={onClose}
          >
            X
          </button>
          <NodeForm actionType={actionType} existingNode={selectedNode} onSubmit={handleFormSubmit} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tree View</h1>
      {/* Modal for Add/Edit form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ul className="space-y-4">{renderTree(hierarchicalTreeData)}</ul> {/* Render the transformed tree data */}
    </div>
  );
};

export default TreeView;
