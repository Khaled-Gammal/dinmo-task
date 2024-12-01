export interface Field {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
}

export interface State {
    loading: boolean;
    error: Record<string, string>;
    [key: string]: any; // For dynamic fields
}

export type Action =
    | { type: "loading" }
    | { type: "error"; payload: Record<string, string> }
    | { type: "success" }
    | { type: "values"; payload: Record<string, any> };



