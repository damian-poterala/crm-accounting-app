export interface Task {
    id: number;
    user_id: number;
    username: string;
    client_id: number | null;
    client: string | null;
    description: string;
    due_date: string;
    is_active: number;
    is_complete: number;
    priority_id: number;
    priority: string;
    created_at: string;
    updated_at: string;
}