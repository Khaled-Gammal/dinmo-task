import {Action, State} from "@/lib/types/shared-types/type";

const initialValues: State = {
    loading: false,
    error: {},
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "loading":
            return { ...state, loading: true, error: {} };
        case "error":
            return { ...state, loading: false, error: action.payload };
        case "success":
            return { ...state, loading: false, error: {} };
        case "values":
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export { reducer, initialValues };