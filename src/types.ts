export interface TreeNode {
  id: number;
  name: string;
  description?: string;
  parentId: number | null;
  type: string;
  children?: TreeNode[];
}
