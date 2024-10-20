"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    getAllArticleAPI,
} from "@/services/article/article";
import { Article } from "@/types/article"; // Ensure this type is defined
import Link from "next/link";

const ArticleList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const limit = 3; // Number of items per page

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

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), [
        handleSearch,
    ]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight ||
            isFetchingMore ||
            currentPage >= totalPages
        ) {
            return;
        }
        setIsFetchingMore(true);
        setCurrentPage((prev) => prev + 1);
        fetchArticle(currentPage + 1);
    };

    return (
        <div className="p-4 min-h-screen">
            <div className="mt-8 mb-10 mx-auto max-w-xl py-2 px-6 rounded-full border flex">
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="text-typography bg-transparent w-full focus:outline-none pr-4 font-semibold border-0 focus:ring-0 px-0 py-0"
                    onChange={(e) => debouncedHandleSearch(e.target.value)}
                />
                <span>
                    <button
                        className={`inline-flex items-center justify-center rounded-full gap-2 min-w-[130px] border border-transparent px-4 py-2 text-sm font-medium text-white $ ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-700'} transition-colors duration-150 ease-in-out w-full`}
                    >
                        Search
                    </button>
                </span>
            </div>

            {loading && currentPage === 1 ? (
                <p className="text-white">Loading articles...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article) => (
                        <div key={article._id} className="bg-gray-800 p-4 rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                            <div className="flex flex-col items-start">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {article.title}
                                </h2>
                                <p className="text-gray-400 mb-4">
                                    {article?.description}
                                </p>
                                <Link href={`/${article.slug}`}>
                                    <button className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200">
                                        Read More
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
