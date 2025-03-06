import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { deleteNode, addNode, editNode } from '../store/hierarchySlice';
import { List, Button, Collapse } from '@mantine/core';
import NodeForm from './HookAddNodeForm';

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
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

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
    setSelectedNode(null);  // Reset the selected node for the "Add Node" action
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
    setIsModalOpen(false);  // Close the modal after submission
  };

  const renderTree = (nodes: any[]) => {
    return nodes.map((node: any) => (
      <li
        key={node.id}
        className="ml-4 mb-4 list-none relative"
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <div className="flex items-center">
          {node.children && node.children.length > 0 && (
            <span
              className="cursor-pointer text-xl"
              onClick={() => toggleNode(node.id)}
            >
              {expandedNodes.has(node.id) ? '[-]' : '[+]'}
            </span>
          )}
          <strong className="font-semibold text-lg mr-1">{node.name}</strong>
          {hoveredNodeId === node.id && (
            <div className="flex p-5">
              <Button
                onClick={() => handleEditNode(node)}
                className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-xs"
                title="Edit Node"
              >
                ✏️
              </Button>
              <Button
                onClick={() => handleDeleteNode(node.id)}
                className="p-2 bg-red-400 text-white rounded hover:bg-red-500 transition text-xs"
                title="Delete Node"
              >
                🗑️
              </Button>
              <Button
                onClick={() => handleAddNode(node.id)}
                className="p-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition text-xs"
                title="Add Node"
              >
                ➕
              </Button>
            </div>
          )}
        </div>
        {node.children && node.children.length > 0 && expandedNodes.has(node.id) && (
          <ul className="ml-6 mt-2">{renderTree(node.children)}</ul>
        )}
      </li>
    ));
  };

  const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
  }) => {
    if (!isOpen || actionType === null) return null;

    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded"
            onClick={onClose}
          >
            X
          </button>
          <NodeForm
            actionType={actionType}
            existingNode={selectedNode}
            onSubmit={handleFormSubmit}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tree View</h1>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ul className="space-y-4">{renderTree(hierarchicalTreeData)}</ul>
    </div>
  );
};

export default TreeView;
