export interface VisualWorkspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export function createVisualWorkspace(name: string): VisualWorkspace {
    const now = new Date();
    return {
        id: crypto.randomUUID(),
        name: name,
        createdAt: now,
        updatedAt: now,
    };
}
