import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";

interface PostFormProps {
  onClose: () => void;
}

const initialValues = {
  title: "",
  body: "",
};

const validationSchema = Yup.object({
  title: Yup.string().min(3, "To short!").max(50, "To long!").required("Required"),
  body: Yup.string()
    .min(10, "Tell us more (min 10 chars)")
    .max(500, "To long!")
    .required("Required"),
});

export default function PostForm({ onClose }: PostFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      toast.success("Post created successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to create post. Try again.");
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        mutation.mutate({
          title: values.title,
          body: values.body,
          userId: 1,
        });
      }}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
