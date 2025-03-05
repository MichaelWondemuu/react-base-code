// treeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TreeNode {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  type: string;
}

interface TreeState {
  nodes: TreeNode[];
}

const initialState: TreeState = {
  nodes: [], // Initial tree nodes
};

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setTreeData: (state, action: PayloadAction<TreeNode[]>) => {
      state.nodes = action.payload;  // Set tree data
    },
    addNode: (state, action: PayloadAction<TreeNode>) => {
      state.nodes.push(action.payload);  // Add a new node to the tree
    },
    editNode: (state, action: PayloadAction<TreeNode>) => {
      const index = state.nodes.findIndex((node) => node.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = action.payload;  // Update the existing node
      }
    },
    deleteNode: (state, action: PayloadAction<number>) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);  // Remove the node
    },
  },
});

export const { setTreeData, addNode, editNode, deleteNode } = treeSlice.actions;
export default treeSlice.reducer;
