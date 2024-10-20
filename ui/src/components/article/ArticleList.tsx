"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    getAllArticleAPI,
    deleteArticleAPI,
    updateArticleAPI,
    createArticleAPI,
} from "@/services/article/article";
import Toast from "@/helpers/toasters";
import Modal from "@/components/modals/Modal";
import Table from "@/components/table/table";
import DeleteModal from "../modals/DeleteModal";
import { Article } from "@/types/article"; // Ensure this type is defined
import { useSelector } from "react-redux";
import Link from "next/link";
import { LiaEdit } from "react-icons/lia";
import { AiOutlineDelete } from "react-icons/ai";
import { FiArrowRightCircle } from "react-icons/fi";

const ArticleList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newArticleTitle, setNewArticleTitle] = useState("");
    const [newArticleContent, setNewArticleContent] = useState("");

    const { user } = useSelector((state: any) => state.auth);

    const limit = 3; 

    useEffect(() => {
        fetchArticle();
    }, []);


    const fetchArticle = async () => {
        setLoading(true);
        try {
            const response = await getAllArticleAPI(currentPage, limit);
            const { articles, totalPages } = response;
            setArticles(articles);
            setTotalPages(totalPages);
            setLoading(false);
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
            const { articles, totalPages } = response;
            setArticles(articles);
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

    const handleDeleteArticle = async () => {
        if (currentArticle) {
            setLoading(true);
            try {
                const response = await deleteArticleAPI(currentArticle._id);
                if (response.success) {
                    setOpenDeleteModal(false);
                    //Toast.successToast("Article deleted successfully");
                    fetchArticle();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleUpdateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentArticle) {
            setLoading(true);
            try {
                const updatedArticle = {
                    ...currentArticle,
                    title: currentArticle.title,
                    content: currentArticle.content,
                };
                const response = await updateArticleAPI(
                    currentArticle._id,
                    updatedArticle
                );
                if (response.success) {
                    setOpenEditModal(false);
                    // Toast.successToast("Article updated successfully");
                    fetchArticle();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAddArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newArticle = {
                title: newArticleTitle,
                content: newArticleContent,
                userId: user?.id,
            };
            const response = await createArticleAPI(newArticle);
            if (response.success) {
                fetchArticle();
                setOpenAddModal(false);
                setNewArticleTitle("");
                setNewArticleContent("");
                setLoading(false);
                Toast.successToast({
                    message: "Article added successfully",
                    autoClose: 1000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    



    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchArticleWhenPageChanges(newPage);
        }
    };

    const fetchArticleWhenPageChanges = async (newPage: number) => {
        setLoading(true);
        setCurrentPage(newPage);
        try {
            const response = await getAllArticleAPI(newPage, limit, searchTerm);
            const { articles, totalPages } = response;
            setArticles(articles);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    

    const columns = [
        { header: "Title", accessor: "title" }, 
        {header: "Created At", render(article: Article) { return new Date(article.createdAt).toLocaleDateString() }},      
        {
            header: "Actions",
            render: (article: Article) => (
                <>
                    <button
                        onClick={() => {
                            setOpenEditModal(true);
                            setCurrentArticle(article);
                        }}
                        className=" text-indigo-600 hover:text-indigo-900  mr-2"
                    >
                        <LiaEdit className="h-12 w-6"/>
                    </button>
                    <button
                        onClick={() => {
                            setOpenDeleteModal(true);
                            setCurrentArticle(article);
                        }}
                        className="text-red-600 mr-2 hover:text-red-900"
                    >
                        <AiOutlineDelete className="h-12 w-6"/>
                    </button>

                    <button
                        className="mr-2  hover:text-gray-900"
                    >
                        <Link href={`/dashboard/articles/${article._id}`} > <FiArrowRightCircle className="h-12 w-6" /> </Link>
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search by title"
                onChange={(e) => debouncedHandleSearch(e.target.value)}
                className="mb-4 mt-2 px-3 py-2 border rounded-md text-grey-500 "
            />

            <button
                onClick={() => setOpenAddModal(true)}
                className="px-4 py-2 bg-gray-300 lg:ml-2 md:ml-2 sm:ml-2 text-gray-800 rounded-md hover:bg-gray-400"
            >
                Add article
            </button>

            {loading ? (
                <p>Loading article...</p>
            ) : (
                <>
                    <Table data={articles} columns={columns} uniqueKey="_id" />
                    <div className="flex justify-between items-center mt-4 gap-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            <Modal
                open={openAddModal}
                onClose={() => { setOpenAddModal(false); setNewArticleTitle(''); setNewArticleContent(''); }}
                header="Add article"
                width="600px"
                body={
                    <form onSubmit={handleAddArticle}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="title"
                            >
                                Title
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                placeholder="Title"
                                value={newArticleTitle}
                                onChange={(e) => setNewArticleTitle(e.target.value)}
                                required
                            />
                        </div>
                        {/* <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="description"
                            >
                                Content
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Content"
                                value={newArticleContent}
                                onChange={(e) => setNewArticleContent(e.target.value)}
                                required
                            />
                        </div> */}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add article
                            </button>
                        </div>
                    </form>
                }
            />

            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                header="Edit article"
                width="600px"
                body={
                    <form onSubmit={handleUpdateArticle}>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium"
                                >
                                    Title:
                                </label>
                                <input
                                    type="text"
                                    value={currentArticle?.title || ""}
                                    onChange={(e) =>
                                        setCurrentArticle({
                                            ...currentArticle,
                                            title: e.target.value,
                                        } as Article)
                                    }
                                    className="mt-1 bg-background block w-full text-typography px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Content:
                                </label>
                                <textarea
                                    value={currentArticle?.content || ""}
                                    onChange={(e) =>
                                        setCurrentArticle({
                                            ...currentArticle,
                                            content: e.target.value,
                                        } as Article)
                                    }
                                    required
                                    className="mt-1 block w-full text-typography px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

                                />
                            </div> */}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                                    onClick={() => setOpenEditModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <button type="submit">Update</button>
                    </form>
                }
            />

            <DeleteModal
                open={openDeleteModal}
                modalText="Are you sure you want to delete this article?"
                onClose={() => setOpenDeleteModal(false)}
                onDeleteUser={handleDeleteArticle}
            />
        </div>
    );
};

export default ArticleList;
