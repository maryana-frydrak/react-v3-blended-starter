import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import css from "./EditPostForm.module.css";
import type { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import toast from "react-hot-toast";

interface EditPostFormProps {
  post: Post;
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3, "To short!").max(50, "To long!").required("Required"),
  body: Yup.string()
    .min(10, "Tell us more (min 10 chars)")
    .max(500, "To long!")
    .required("Required"),
});

export default function EditPostForm({ post, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      toast.success("Post editet successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to edit post.Try again.");
    },
  });

  const handleSubmit = (values: Post) => {
    mutation.mutate(values);
  };

  return (
    <Formik initialValues={post} onSubmit={handleSubmit} validationSchema={validationSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
