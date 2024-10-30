"use client"
import React, { useState, useEffect, useCallback } from "react";
import { getAllArticleAPI } from "@/services/article/article";
import { Article } from "@/types/article";
import Link from "next/link";
import { Clock, User } from "lucide-react";


const MAX_DESCRIPTION_LENGTH = 100;
const ArticleList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 3;

  useEffect(() => {
    fetchArticle();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchArticle = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllArticleAPI(page, limit, searchTerm);
      const { articles: fetchedArticles, totalPages } = response;
      setArticles(prev => (page === 1 ? fetchedArticles : [...prev, ...fetchedArticles]));
      setTotalPages(totalPages);
      setLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = useCallback(async (title: string) => {
    setSearchTerm(title);
    setLoading(true);
    setCurrentPage(1);
    try {
      const response = await getAllArticleAPI(1, limit, title);
      const { articles: fetchedArticles, totalPages } = response;
      setArticles(fetchedArticles);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, []);

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), [handleSearch]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 && currentPage < totalPages) {
      setIsFetchingMore(true);
      setCurrentPage(prev => prev + 1);
      fetchArticle(currentPage + 1);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-900">
      <div className="mt-8 mb-10 mx-auto max-w-xl py-2 px-6 rounded-full border flex">
        <input
          type="text"
          placeholder="Search articles..."
          className="text-typography bg-transparent w-full focus:outline-none pr-4 font-semibold border-0 focus:ring-0 px-0 py-0"
          onChange={(e) => debouncedHandleSearch(e.target.value)}
          aria-label="Search articles by title"
        />
        <span>
          <button
            className={`inline-flex items-center justify-center rounded-full gap-2 min-w-[130px] border border-transparent px-4 py-2 text-sm font-medium text-black ${loading ? 'bg-gray-400' : 'bg-primary text-primary-foreground'} transition-colors duration-150 ease-in-out w-full`}
            aria-label="Search button"
          >
            Search
          </button>
        </span>
      </div>

      {loading && currentPage === 1 ? (
        <p className="text-white text-center">Loading articles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map(article => (
            <div
              key={article._id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              <div>
                <h3 className="text-xl font-bold text-white line-clamp-2 mb-2">
                  {article.title}
                </h3>
              </div>
              <div className="flex-grow">
                <p className="text-white mb-4 line-clamp-3">
                  {article?.description.length > MAX_DESCRIPTION_LENGTH
                    ? `${article.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
                    : article.description}.
                </p>
                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex items-center" aria-label={`Published on ${new Date(article.createdAt).toLocaleDateString()}`}>
                    <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center" aria-label={`Author ${article.userId?.name || 'Anonymous'}`}>
                    <User className="w-4 h-4 mr-1" aria-hidden="true" />
                    <span>{article.userId?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/${article.slug}`} className="w-full" aria-label={`Read more about ${article.title}`}>
                  <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                    <span>Read More</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFetchingMore && (
        <div className="text-white text-center py-4">Loading more articles...</div>
      )}
    </div>
  );
};

export default ArticleList;
