"use client";
import React, { useEffect, useState } from "react";
import {
  getChapterByIdAPI,
  updateChapterAPI,
} from "@/services/chapters/chapter"; // Assuming both methods are exported from the same file
import { Chapter } from "@/types/chapter";
import Toast from "@/helpers/toasters";
import TinyMCEEditor from "@/components/editor/TinyMCE";
import "@/styles/article.css";
import {
  getAllCourseAPI, // Define this API method to fetch all courses
} from "@/services/course/course";
import { Course } from "@/types/course";

interface ChapterViewProps {
  params: {
    chapter: string[];
  };
}

const ChapterView: React.FC<ChapterViewProps> = ({ params }) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [preview, setPreview] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    if (params && params.chapter && params.chapter.length > 0) {
      const chapterId = String(params.chapter);
      fetchChapter(chapterId);
      fetchCourses();
    }
  }, [params]);

  const fetchChapter = async (chapterId: string) => {
    setLoading(true);
    try {
      const response = await getChapterByIdAPI(chapterId);
      setChapter(response.data);
      updateCounts(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getAllCourseAPI();
      setCourses(response.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleEditorChange = (content: any) => {
    console.log("content: ", content);
    if (chapter) {
      setChapter({ ...chapter, content });
      updateCounts(content);
    }
  };

  const getWordCount = (content: string): number => {
    return content.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const getImageCount = (content: string): number => {
    const imgTags = content.match(/<img [^>]*src="[^"]*"[^>]*>/g);
    return imgTags ? imgTags.length : 0;
  };

  const updateCounts = (content: string) => {
    setWordCount(getWordCount(content));
    setImageCount(getImageCount(content));
  };

  const handleEditorSave = async () => {
    if (chapter) {
      // Perform any necessary logic to save the chapter content
      try {
        const newChapter = {
          title: chapter.title,
          content: chapter.content,
          courseId: chapter.courseId,
          excerpt: chapter.excerpt,
          tags: chapter.tags,
          metaDescription: chapter.metaDescription,
          chapterSlug: chapter.chapterSlug,
          keyPhrase: chapter.keyPhrase,
        };
        const response = await updateChapterAPI(chapter._id, newChapter);
        if (response.success) {
          Toast.successToast({
            message: "Chapter updated successfully",
            autoClose: 1000,
            position: "top-right",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (chapter) {
      setChapter({ ...chapter, [name]: value });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log("chapter: ", chapter?.content);

  return (
    <div className="p-2 md:p-4 lg:p-6 w-full">
      <div className="flex justify-end items-center mb-4 space-x-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-full transition duration-300 text-xs md:text-sm"
          onClick={handleEditorSave}
        >
          Update
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-full transition duration-300 text-xs md:text-sm">
          Draft
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-full transition duration-300 text-xs md:text-sm"
          onClick={() => setPreview(!preview)}
        >
          Preview
        </button>
      </div>
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
        {chapter?.title}
      </h3>
      {preview ? (
        <div
          dangerouslySetInnerHTML={{
            __html: chapter?.content ? chapter?.content : "",
          }}
          className="content"
        />
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-9/12">
            <TinyMCEEditor
              initialValue={chapter?.content ? chapter?.content : ""}
              onEditorChange={handleEditorChange}
            />
          </div>
          <div className="w-full lg:w-3/12 p-4 bg-gray-100 rounded-lg shadow-md lg:ml-4 mt-4 lg:mt-0">
            <h4 className="text-md font-bold mb-2">Chapter Details</h4>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={chapter?.title || ""}
                onChange={handleFormChange}
                className="p-2 border border-gray-300 rounded-md"
              />
              <select
              value={chapter?.courseId}
              onChange={(e) =>
                setChapter({
                  ...chapter,
                  courseId: e.target.value,
                } as Chapter)
              }
              className="shadow mt-2  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
              <textarea
                name="excerpt"
                placeholder="Excerpt"
                value={chapter?.excerpt || ""}
                onChange={handleFormChange}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags"
                value={chapter?.tags || ""}
                onChange={handleFormChange}
                className="p-2 border border-gray-300 rounded-md"
              />
              <textarea
                name="metaDescription"
                placeholder="Meta Description"
                value={chapter?.metaDescription || ""}
                onChange={handleFormChange}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="chapterSlug"
                placeholder="Chapter Slug"
                value={chapter?.chapterSlug || ""}
                onChange={handleFormChange}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="keyPhrase"
                placeholder="Key Phrase"
                value={chapter?.keyPhrase || ""}
                onChange={handleFormChange}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>            
            <div className="mt-4 text-sm text-gray-700">
              Word Count: {wordCount} | Image Count: {imageCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterView;
