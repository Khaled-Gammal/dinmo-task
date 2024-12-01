"use client";

import { toast } from "sonner";

import { IPosts, IPostWithoutId } from "@/lib/types/posts/type";
import { useAddDialog } from "@/hooks/use-add-dialog";
import { handlePostInServer } from "@/lib/actions/post-server";
import { useEditDialog } from "@/hooks/use-edit-dialog";
import { compareData } from "@/lib/utils";
import { useConfirmMessage } from "@/hooks/use-delete-dialog";
import { handleDeleteRow } from "@/lib/actions/delete-server";
import { handleUpdateInServer } from "@/lib/actions/patch-server";
import { DataTableDemo } from "@/components/shared/table-data";
import {
  addPostFields,
  editPostFields,
} from "@/components/tables/posts/constant-data";
import { State } from "@/lib/types/shared-types/type";

interface Posts {
  id: string | number;
  [key: string]: string | number;
}

interface Response {
  success?: string;
  error?: string;
}
interface actionPostResponse {
  success: boolean;
  error: boolean;
}

export default function TablesPosts({ posts }: { posts: IPosts[] }) {
  const columns = [
    {
      id: "select",
      header: "",
      className: "text-center",
      accessorKey: "id",
    },
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      className: "text-center",
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
    },
    {
      id: "body",
      header: "Body",
      accessorKey: "body",
      className: "text-center",
    },
    {
      id: "actions",
      header: "Actions",
      accessorKey: "actions",
      className: "text-center",
    },
  ];

  const postsData = posts.map((post) => {
    return {
      id: post.id,
      title: post.title,
      body: post.body,
    };
  }
  );
  // add data dialog
  const [addDialog] = useAddDialog({
    onConfirm: async (state) => await handleAddPostClick(state),
    title: "Add a New Instructor",
    fields: addPostFields,
  });

  // edit post dialog
  const [handleEditPost, editPostConfirmDialog] = useEditDialog({
    onConfirm: async (state) =>
      handleEdit(state, posts, compareData, handleUpdateInServer),
    title: "Edit Group",
    fields: editPostFields,
  });  

  // delete post dialog
  const [handleDeletePost, deletePostConfirmDialog] = useConfirmMessage({
    onConfirm: async (row) => await handleDelet(row),
    text: "Do you sure you wanna to delete this post ? ",
    title: "Delete Posts",
    successMessage: "Post deleted successfully",
  });

  const handleAddPostClick = async (state: State): Promise<void> => {
    const data: IPostWithoutId = Object.entries(state).reduce(
      (acc: IPostWithoutId, [key, value]) => {
        if (key !== "loading" && key !== "error") {
          acc[key as keyof IPostWithoutId] = value;
        }
        return acc;
      },
      {} as IPostWithoutId
    );

    const response: actionPostResponse =
      await handlePostInServer<IPostWithoutId>({
        End_Point: "/posts",
        bodyData: data,
        path: "/",
      });

    // Handle response
    if (response.success) {
      toast.success("New post added successfully.");
    } else {
      toast.success("New post added successfully.");
    }
  };

  const handleEdit = async (
    state: Record<string, any>,
    posts: Posts[],
    compareData: (
      row: Posts,
      state: Record<string, any>
    ) => Record<string, any>,
    handleUpdateInServer: (
      endpoint: string,
      data: Record<string, unknown>,
      revalidatePath: string
    ) => Promise<Response>
  ) => {
    try {
      // Iterate over each group and handle the edit
      postsData.forEach(async (row) => {
        
        if (row.id === state.id) {
          // Compare the data and find changes
          const changes = compareData(row, state);
          if (Object.keys(changes).length > 0) {
            console.log("changes=>", changes);

            // Prepare form data for the API
            const formData = changes;
            console.log("formData=>", formData);
            // Call the API to update the group
            const response = await handleUpdateInServer(
              `/posts/${row.id}/`,
              formData,
              "/"
            );

            // Handle the response
            if (response.success) {
              toast.success(response.success);
            } else {
              toast.error(
                response.error || "An error occurred while updating the post."
              );
            }
          }
        }
      }
      );
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast.error(error.message || "Unexpected error occurred.");
    }
  };

  const handleDelet = async (row: Posts): Promise<string> => {
    const response = await handleDeleteRow({
      End_Point: "/posts/",
      id: row.id,
      path: "/",
    });
    if (response.success) {
      return "Post deleted successfully";
    } else {
      return "Failed to delete post.";
    }
  };

  return (
    <div className="px-4">
      <div className="flex justify-end mb-4">
      {addDialog}
      </div>
      <DataTableDemo
        columns={columns}
        data={postsData}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />
      {editPostConfirmDialog}
      {deletePostConfirmDialog}
    </div>
  );
}
