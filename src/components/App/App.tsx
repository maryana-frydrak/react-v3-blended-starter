import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import PostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { Post } from "../../types/post";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { data } = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPage = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;
  const posts = data?.posts || [];
  const handleSearch = useDebouncedCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, 1000);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {totalPage > 1 && (
          <Pagination
            totalPages={totalPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {selectedPost ? (
            <EditPostForm post={selectedPost} onClose={closeModal} />
          ) : (
            <PostForm onClose={closeModal} />
          )}
        </Modal>
      )}
      {posts.length > 0 && (
        <PostList posts={posts} toogleModal={openModal} toogleEditPost={handleEditPost} />
      )}
    </div>
  );
}
