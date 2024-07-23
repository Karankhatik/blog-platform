"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllCourseAPI,
  deleteCourseAPI,
  updateCourseAPI,
  createCourseAPI,
} from "@/services/course/course";
import Toast from "@/helpers/toasters";
import Modal from "@/components/modals/Modal";
import Table from "@/components/table/table";
import DeleteModal from "../modals/DeleteModal";
import { Course } from "@/types/course";

const CourseList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  const limit = 3; // Number of items per page

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourseAPI(currentPage, limit);
      const { courses, totalPages } = response;
      setCourses(courses);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const fetchCoursesWhenPageChanges = async (newPage: number) => {
    setLoading(true);
    setCurrentPage(newPage);
    try {
      const response = await getAllCourseAPI(newPage, limit, searchTerm);
      const { courses, totalPages } = response;
      setCourses(courses);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchCoursesWhenPageChanges(newPage);
    }
  };

  const handleDeleteCourse = async () => {
    setLoading(true);
    try {
      if (currentCourse) {
        const response = await deleteCourseAPI(currentCourse._id);
        if (response.success) {
          setOpenDeleteModal(false);
          Toast.successToast({
            message: "Course deleted successfully",
            autoClose: 1000,
            position: "top-right",
          });
          fetchCourses();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCourse = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentCourse) {
        const response = await updateCourseAPI(
          currentCourse._id,
          currentCourse
        );
        if (response.success) {
          setOpenEditModal(false);
          Toast.successToast({
            message: "Course updated successfully",
            autoClose: 1000,
            position: "top-right",
          });
          fetchCourses();
        }
      }
    } catch (error) {
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

  const handleSearch = async (title: string) => {
    setSearchTerm(title);
    setLoading(true);
    setCurrentPage(1);
    try {
      const response = await getAllCourseAPI(1, limit, title);
      const { courses, totalPages } = response;
      setCourses(courses);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const handleAddCourse = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createCourseAPI({
        title: newCourseTitle,
        description: newCourseDescription,
      });
      if (response.success) {
        setOpenAddModal(false);
        setNewCourseTitle("");
        setNewCourseDescription("");
        Toast.successToast({
          message: "Course added successfully",
          autoClose: 1000,
          position: "top-right",
        });
        fetchCourses();
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Discription", accessor: "description" },
    {
      header: "Created At",
      render: (course: Course) =>
        new Date(course.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      render: (course: Course) => (
        <>
          <button
            onClick={() => {
              setOpenEditModal(true);
              setCurrentCourse(course);
            }}
            className="text-indigo-600 hover:text-indigo-900 mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setCurrentCourse(course);
            }}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="">
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
          Add Course
        </button>

        <Modal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          header={<div>Add Course</div>}
          width="500px"
          height="auto"
          body={
            <form onSubmit={handleAddCourse}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Description"
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Add Course
                </button>
              </div>
            </form>
          }
        />

        <div className="overflow-x-auto">
          <div className="min-w-md lg:min-w-lg">
            <Table data={courses} columns={columns} uniqueKey="_id" />
          </div>
        </div>
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
      </div>

      <Modal
        open={openEditModal}
        width="600px"
        height="auto"
        onClose={() => setOpenEditModal(false)}
        header={<div>Edit Course</div>}
        body={
          <form onSubmit={handleUpdateCourse}>
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
                  id="title"
                  value={currentCourse?.title || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      title: e.target.value,
                    } as Course)
                  }
                  className="mt-1 block w-full text-typography px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description:
                </label>
                <textarea                 
                  id="name"
                  value={currentCourse?.description || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      description: e.target.value,
                    } as Course)
                  }
                  className="mt-1 block w-full text-typography px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

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
          </form>
        }
      />

      <DeleteModal
        open={openDeleteModal}
        modalText="Are you sure you want to delete this course?"
        onClose={() => setOpenDeleteModal(false)}
        onDeleteUser={handleDeleteCourse}
      />
    </>
  );
};

export default CourseList;
