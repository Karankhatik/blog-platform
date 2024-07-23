"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    getAllChaptersAPI,
    deleteChapterAPI,
    updateChapterAPI,
    createChapterAPI,
} from "@/services/chapters/chapter";
import {
    getAllCourseAPI, // Define this API method to fetch all courses
} from "@/services/course/course";
import Toast from "@/helpers/toasters";
import Modal from "@/components/modals/Modal";
import Table from "@/components/table/table";
import DeleteModal from "../modals/DeleteModal";
import { Chapter } from "@/types/chapter"; // Ensure this type is defined
import { Course } from "@/types/course";
import { useSelector } from "react-redux";
import Link from "next/link";

const ChapterList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState("");
    const [newChapterContent, setNewChapterContent] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);

    const { user } = useSelector((state: any) => state.auth);

    const limit = 3; // Number of items per page

    console.log("user: ", user);

    useEffect(() => {
        fetchChapters();
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await getAllCourseAPI();
            setCourses(response.courses);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }
    };

    const fetchChapters = async () => {
        setLoading(true);
        try {
            const response = await getAllChaptersAPI(currentPage, limit);
            const { chapters, totalPages } = response;
            setChapters(chapters);
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
            const response = await getAllChaptersAPI(1, limit, title);
            const { chapters, totalPages } = response;
            setChapters(chapters);
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

    const handleDeleteChapter = async () => {
        if (currentChapter) {
            setLoading(true);
            try {
                const response = await deleteChapterAPI(currentChapter._id);
                if (response.success) {
                    setOpenDeleteModal(false);
                    //Toast.successToast("Chapter deleted successfully");
                    fetchChapters();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleUpdateChapter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentChapter) {
            setLoading(true);
            try {
                const updatedChapter = {
                    ...currentChapter,
                    title: currentChapter.title,
                    content: currentChapter.content,
                    courseId: currentChapter.courseId,
                };
                const response = await updateChapterAPI(
                    currentChapter._id,
                    updatedChapter
                );
                if (response.success) {
                    setOpenEditModal(false);
                    // Toast.successToast("Chapter updated successfully");
                    fetchChapters();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAddChapter = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newChapter = {
                title: newChapterTitle,
                content: newChapterContent,
                courseId: selectedCourseId,
                userId: user?.id,
            };
            const response = await createChapterAPI(newChapter);
            if (response.success) {
                fetchChapters();
                setOpenAddModal(false);
                setNewChapterTitle("");
                setNewChapterContent("");
                setSelectedCourseId("");
                setLoading(false);
                Toast.successToast({
                    message: "Chapter added successfully",
                    autoClose: 1000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const courseDropdown = () => (
        <select
            value={selectedCourseId || ""}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
            <option value="" disabled>
                Not selected
            </option>
            {courses.map((course) => (
                <option key={course._id} value={course._id}>
                    {course.title}
                </option>
            ))}
        </select>
    );



    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchChaptersWhenPageChanges(newPage);
        }
    };

    const fetchChaptersWhenPageChanges = async (newPage: number) => {
        setLoading(true);
        setCurrentPage(newPage);
        try {
            const response = await getAllChaptersAPI(newPage, limit, searchTerm);
            const { chapters, totalPages } = response;
            setChapters(chapters);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const courseDropdownForUpdate = () => (
        <select
            value={currentChapter?.courseId}
            onChange={(e) =>
                setCurrentChapter({
                    ...currentChapter,
                    courseId: e.target.value,
                } as Chapter)
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
            {courses.map((course) => (
                <option key={course._id} value={course._id}>
                    {course.title}
                </option>
            ))}
        </select>
    );

    const columns = [
        { header: "Title", accessor: "title" },
        {
            header: "Course",
            render: (chapter: Chapter) => {
                return courses.find((course) => course._id === chapter.courseId)?.title;
            },
        },
        {
            header: "Actions",
            render: (chapter: Chapter) => (
                <>
                    <button
                        onClick={() => {
                            setOpenEditModal(true);
                            setCurrentChapter(chapter);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setOpenDeleteModal(true);
                            setCurrentChapter(chapter);
                        }}
                        className="text-red-600 mr-2 hover:text-red-900"
                    >
                        Delete
                    </button>

                    <button
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                        <Link href={`/dashboard/chapters/${chapter._id}`} > View </Link>
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
                className="mb-4 mt-2 px-3 py-2 border rounded-md"
            />

            <button
                onClick={() => setOpenAddModal(true)}
                className="px-4 py-2 bg-gray-300 lg:ml-2 md:ml-2 sm:ml-2 text-gray-800 rounded-md hover:bg-gray-400"
            >
                Add Chapter
            </button>

            {loading ? (
                <p>Loading chapters...</p>
            ) : (
                <>
                    <Table data={chapters} columns={columns} uniqueKey="_id" />
                    <div className="flex justify-between items-center mt-4 gap-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            <Modal
                open={openAddModal}
                onClose={() => { setOpenAddModal(false); setNewChapterTitle(''); setNewChapterContent(''); setSelectedCourseId(''); }}
                header="Add Chapter"
                width="600px"
                body={
                    <form onSubmit={handleAddChapter}>
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
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
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
                                value={newChapterContent}
                                onChange={(e) => setNewChapterContent(e.target.value)}
                                required
                            />
                        </div> */}
                        {courseDropdown()}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add Chapter
                            </button>
                        </div>
                    </form>
                }
            />

            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                header="Edit Chapter"
                width="600px"
                body={
                    <form onSubmit={handleUpdateChapter}>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title:
                                </label>
                                <input
                                    type="text"
                                    value={currentChapter?.title || ""}
                                    onChange={(e) =>
                                        setCurrentChapter({
                                            ...currentChapter,
                                            title: e.target.value,
                                        } as Chapter)
                                    }
                                    className="mt-1 block w-full text-typography px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    value={currentChapter?.content || ""}
                                    onChange={(e) =>
                                        setCurrentChapter({
                                            ...currentChapter,
                                            content: e.target.value,
                                        } as Chapter)
                                    }
                                    required
                                    className="mt-1 block w-full text-typography px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

                                />
                            </div> */}

                            {courseDropdownForUpdate()}

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
                modalText="Are you sure you want to delete this chapter?"
                onClose={() => setOpenDeleteModal(false)}
                onDeleteUser={handleDeleteChapter}
            />
        </div>
    );
};

export default ChapterList;
