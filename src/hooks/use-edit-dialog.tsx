import { useEffect, useReducer, useState } from "react";
import InputField from "@/components/shared/input-field";
import TextAreaField from "@/components/shared/text-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FieldType =
  | "text"
  | "description";

interface Field {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface State {
  loading: boolean;
  error: Record<string, string | null>;
  [key: string]: any; // For dynamic fields
}

type Action =
  | { type: "loading" }
  | { type: "error"; payload: Record<string, any> }
  | { type: "success" }
  | { type: "values"; payload: Record<string, any> };

const initialValues: State = {
  loading: false,
  error: {},
};
interface UseEditDialogProps {
  title?: string;
  fields: Field[];
  onConfirm: (values: Record<string, any>) => Promise<void>;
}

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

export const useEditDialog = ({
  title = "Edit Item",
  fields,
  onConfirm,
}: UseEditDialogProps): [handleOpen: (...params: any[]) => void, dialog: JSX.Element] => {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState<any[] | null>(null);

  const handleOpen = (...params: any[]) => {
    setArgs(params);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, dispatch] = useReducer(reducer, initialValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "loading" });
    try {
      await onConfirm(state);
      dispatch({ type: "success" });
    } catch (error: any) {
      dispatch({ type: "error", payload: error.message || "An error occurred" });
    }
  };

  useEffect(() => {
    
    if (args) {
      dispatch({ type: "values", payload:args.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }
      
      )});
    }
  }, [args]);

  const dialog = (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-primary text-lg font-medium">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-4 pt-[35px] mb-4">
          {fields.map((field) =>
                field.type === "description" ? (
                  <div className="w-full" key={field.id}>
                    <TextAreaField
                      name={field.name}
                      label={field.label}
                      placeholder={field.placeholder}
                      error={state.error[field.name] || ""}
                      value={state[field.name] || ""}
                      onChange={(e) => {
                        dispatch({
                          type: "values",
                          payload: { [field.name]: e.target.value },
                        });
                        dispatch({
                          type: "error",
                          payload: { [field.name]: "" },
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full" key={field.id}>
                    <InputField
                      name={field.name}
                      type={field.type}
                      id={field.id}
                      label={field.label}
                      placeholder={field.placeholder}
                      error={state.error[field.name] || undefined}
                      value={state[field.name] || ""}
                      onChange={(e) => {
                        dispatch({
                          type: "values",
                          payload: { [field.name]: e.target.value },
                        });
                        dispatch({
                          type: "error",
                          payload: { [field.name]: "" },
                        });
                      }}
                    />
                  </div>
                )
              )}
          </div>
          <DialogFooter className="flex items-center justify-between gap-6 md:gap-[60px]">
            <DialogClose asChild>
              <Button className="cancel-button w-full" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button className="confirm-button w-full" type="submit" disabled={state.loading}>
              {state.loading ? "Loading..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return [handleOpen, dialog];
};
