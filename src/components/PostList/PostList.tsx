import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";
import toast from "react-hot-toast";

interface postListProps {
  posts: Post[];
  toogleModal: () => void;
  toogleEditPost: (post: Post) => void;
}

export default function PostList({ posts, toogleModal, toogleEditPost }: postListProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      toast.success("Post deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete post. Try again.");
    },
  });
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              className={css.edit}
              onClick={() => {
                toogleEditPost(post);
                toogleModal();
              }}
            >
              Edit
            </button>
            <button onClick={() => mutation.mutate(post.id!)} className={css.delete}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
