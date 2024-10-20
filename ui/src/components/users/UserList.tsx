"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getAllTheUsers,
  deleteUserByAdmin,
  updateUserByAdmin,
} from "@/services/users/user";
import Toast from "@/helpers/toasters";
import Modal from "@/components/modals/Modal";
import Table from "../table/table";
import DeleteModal from "../modals/DeleteModal";
import {User} from "@/types/user";
import { LiaEdit } from "react-icons/lia";
import { AiOutlineDelete } from "react-icons/ai";


const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const limit = 3; // Number of items per page

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllTheUsers(currentPage, limit);
      const { users, totalPages } = response;
      setUsers(users);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const fetchUsersWhenPageChanges = async (newPage: number) => {
    setLoading(true);
    setCurrentPage(newPage);
    try {
      const response = await getAllTheUsers(newPage, limit, searchTerm);
      const { users, totalPages } = response;
      setUsers(users);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchUsersWhenPageChanges(newPage);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        const response = await deleteUserByAdmin(currentUser._id);
        if (response.success) {
          setOpenDeleteModal(false);
          Toast.successToast({
            message: "User deleted successfully",
            autoClose: 1000,
            position: "top-right",
          });
          fetchUsers();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentUser) {
        const response = await updateUserByAdmin(currentUser._id, currentUser);
        if (response.success) {
          setOpenEditModal(false);
          Toast.successToast({
            message: "User updated successfully",
            autoClose: 1000,
            position: "top-right",
          });
          fetchUsers();
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

  const handleSearch = async (email: string) => {
    setSearchTerm(email);
    setLoading(true);
    setCurrentPage(1);
    try {
      const response = await getAllTheUsers(1, limit, email);
      const { users, totalPages } = response;
      setUsers(users);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Editor",
      render: (user: User) => (user.isEditor ? "Yes" : "No"),
    },
    {
      header: "Requested",
      render: (user: User) => (user.isRequested ? "Yes" : "No"),
    },
    {
      header: "Created At",
      render: (user: User) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      render: (user: User) => (
        <>
          <button
            onClick={() => {
              setOpenEditModal(true);
              setCurrentUser(user);
            }}
            className="text-indigo-600 hover:text-indigo-900 mr-2"
          >
            <LiaEdit className="h-12 w-6"/>
       
        
          </button>
          <button
            onClick={() => {
              setOpenDeleteModal(true);
              setCurrentUser(user);
            }}
            className="text-red-600 hover:text-red-900"
          >
            <AiOutlineDelete className="h-12 w-6"/>
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
          placeholder="Search by email"
          onChange={(e) => debouncedHandleSearch(e.target.value)}
          className="mb-4 mt-2 px-3 py-2 border rounded-md text-grey-500 bg-background"
        />
        <div className="overflow-x-auto">
          <div className="min-w-md lg:min-w-lg">
            <Table data={users} columns={columns} uniqueKey="_id" />
          </div>
        </div>
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
      </div>

      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        header={<div>Edit User</div>}
        width="700px"
        height="auto"
        body={
          <form onSubmit={handleUpdateUser}>
            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium "
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentUser?.name || ""}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      name: e.target.value,
                    } as User)
                  }
                  className="mt-1 bg-background block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="isEditor"
                  className="block text-sm font-medium"
                >
                  Editor:
                </label>
                <select
                  id="isEditor"
                  value={currentUser?.isEditor ? "true" : "false"}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      isEditor: e.target.value === "true",
                    } as User)
                  }
                  className="mt-1 bg-background block w-full pl-3 pr-10 py-2  border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="isRequested"
                  className="block text-sm font-medium"
                >
                 Requested:
                </label>
                <select
                  id="isRequested"
                  value={currentUser?.isRequested ? "true" : "false"}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      isRequested: e.target.value === "true",
                    } as User)
                  }
                  className="mt-1 block bg-background w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
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
        modalText="Are you sure you want to delete this user?"
        onClose={() => setOpenDeleteModal(false)}
        onDeleteUser={handleDeleteUser}
      />
    </>
  );
};

export default UserList;
