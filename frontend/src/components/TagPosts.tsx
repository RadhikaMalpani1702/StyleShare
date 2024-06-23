import { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import { userState } from "../store/atoms/auth";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import usePosts from "../hooks/usePosts";
import bgHero from "../assets/bgHero.png";
import { useParams } from "react-router-dom";

const TagPosts = () => {
  const currentUser = useRecoilValue(userState);
  const { tag } = useParams();
  const {
    posts: allPosts, // Rename posts to allPosts to preserve the original posts fetched
    loading,
    error,
    page,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    handlePageClick,
    handleDelete,
    addTag,
    removeTag,
    searchQuery,
    setSearchQuery,
    tags,
  } = usePosts({
    initialPage: 1,
    pageSize: 12,
  });

  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterTags, setFilterTags] = useState<string[]>(tag ? [tag] : []);

  const { t } = useTranslation();

  useEffect(() => {
    if (tag) {
      setFilterTags([tag]);
    }
  }, [tag]);

  const toggleFilterDialog = () => {
    setShowFilterDialog(!showFilterDialog);
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput.toLowerCase())) {
      addTag(tagInput.toLowerCase()); // Use addTag function from usePosts
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    removeTag(tagToRemove); // Use removeTag function from usePosts
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-500 font-semibold text-lg text-center">
        {error}
      </div>
    );
  }

  // Filter posts based on filterTags
  const filteredPosts = allPosts.filter((post) =>
    filterTags.every((tag) =>
      post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    )
  );

  return (
    <div
      className="-mt-7 min-h-screen text-[#000435] bg-white dark:text-white dark:bg-[#000435]"
      style={{
        backgroundImage: `url(${bgHero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-screen-xl flex flex-col items-center justify-center mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4 text-[#5f67de] bg-white dark:text-white dark:bg-[#000435]">
          {tag && `${tag} `} {t("allPosts.Posts")}
        </h1>
        <div className="w-full flex justify-between mb-4 relative">
          <button
            onClick={toggleFilterDialog}
            className="flex items-center text-[#5f67de] bg-white dark:text-white dark:bg-[#000435] hover:text-blue-400"
          >
            {t("allPosts.filter")}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {showFilterDialog && (
            <div
              ref={filterRef}
              className="absolute top-full mt-2 bg-gray-800 p-4 rounded shadow-lg w-full max-w-md"
            >
              <div className="mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("allPosts.tag")}
                  className="p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <button
                onClick={handleAddTag}
                className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-700"
              >
                {t("allPosts.tag")}
              </button>
              <div className="mt-2 flex flex-wrap">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-700 text-white px-2 py-1 rounded mr-2 mb-2"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 focus:outline-none"
                    >
                      <svg
                        className="w-4 h-4 fill-current text-red-500"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 0c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm5 13.586-1.414 1.414-3.586-3.586-3.586 3.586-1.414-1.414 3.586-3.586-3.586-3.586 1.414-1.414 3.586 3.586 3.586-3.586 1.414 1.414-3.586 3.586 3.586 3.586z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={t("allPosts.search")}
            className="p-2 w-full max-w-xs rounded-md text-[#000435] bg-white dark:text-white dark:bg-[#000435] border border-sky-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {filteredPosts.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              onDelete={handleDelete}
              currentUser={currentUser}
            />
          ))}
        </div>
        <div className="flex justify-center items-center mt-4 w-full space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`text-white px-4 py-2 rounded ${
              page === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {t("allPosts.pre")}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageClick(i + 1)}
              className={`text-white px-4 py-2 rounded ${
                page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`text-white px-6 py-2 rounded ${
              page === totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {t("allPosts.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagPosts;
