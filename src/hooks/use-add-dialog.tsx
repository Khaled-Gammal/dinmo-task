import React, { useReducer, useState } from "react";

import { validate } from "@/lib/validation";

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
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2, Plus } from "lucide-react";
import { Field, State } from "@/lib/types/shared-types/type";
import { initialValues, reducer } from "@/lib/reducer/useAddDialogReducer";

interface UseAddDialogProps {
  title?: string;
  fields: Field[];
  onConfirm: (state: State) => Promise<void>;
}

export const useAddDialog = ({
  title = "Add Items",
  fields,
  onConfirm,
}: UseAddDialogProps): [JSX.Element] => {
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialValues);

  const schema = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: { required: field.required },
    }),
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, errors } = validate(state, schema);
    if (!valid) {
      const formattedErrors = Object.keys(errors).reduce((acc, key) => {
        acc[key] = errors[key].join(", ");
        return acc;
      }, {} as Record<string, string>);
      dispatch({ type: "error", payload: formattedErrors });
      return;
    }

    dispatch({ type: "loading" });
    try {
      await onConfirm(state);
      dispatch({ type: "success" });
      closeDialog();
    } catch (error: any) {
      dispatch({ type: "error", payload: { global: error.message } });
    }
  };

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const dialog = (
    <>
      <div className="flex justify-end items-center">
        <Button
          variant="outline"
          className="flex justify-center border"
          onClick={openDialog}
        >
          Add
          <Plus size={32} />
        </Button>
      </div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-primary text-lg font-medium">
              {title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4 pt-[35px] pb-[29px]">
              {fields.map((field) =>
                field.type === "description" ? (
                  <div className="w-full" key={field.id}>
                    <TextAreaField
                      name={field.name}
                      label={field.label}
                      placeholder={field.placeholder}
                      error={state.error[field.name]}
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
                      error={state.error[field.name]}
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
            <DialogFooter className="flex items-center justify-between gap-6 md:gap-[60px] py-4">
              <DialogClose asChild>
                <Button className="cancel-button w-full" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="confirm-button w-full"
                type="submit"
                disabled={state.loading}
              >
                {state.loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  "Add"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );

  return [dialog];
};
