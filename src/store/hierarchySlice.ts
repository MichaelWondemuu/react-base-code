import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';  // Import axios

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
  nodes: [],
};

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setTreeData: (state, action: PayloadAction<TreeNode[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<TreeNode>) => {
      // Optimistic update in the state
      state.nodes.push(action.payload);

      // Make API call to add the node to the server
      axios.post('http://localhost:7000/tree', action.payload)
        .catch(error => {
          console.error('Error adding node:', error);
          // You can add more error handling or rollback the state here if needed
        });
    },
    editNode: (state, action: PayloadAction<TreeNode>) => {
      const index = state.nodes.findIndex((node) => node.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = action.payload;

        // Make API call to update the node on the server
        axios.put(`http://localhost:7000/tree/${action.payload.id}`, action.payload)
          .catch(error => {
            console.error('Error editing node:', error);
            // You can add more error handling or rollback the state here if needed
          });
      }
    },
    deleteNode: (state, action: PayloadAction<number>) => {
      // Optimistic update in the state
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);

      // Make API call to delete the node on the server
      axios.delete(`http://localhost:7000/tree/${action.payload}`)
        .catch(error => {
          console.error('Error deleting node:', error);
          // You can add more error handling or rollback the state here if needed
        });
    },
  },
});

export const { setTreeData, addNode, editNode, deleteNode } = treeSlice.actions;
export default treeSlice.reducer;
