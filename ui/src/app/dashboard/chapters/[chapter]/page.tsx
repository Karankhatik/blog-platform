"use client";
import React, { useEffect, useState } from "react";
import { getChapterByIdAPI } from "@/services/chapters/chapter"; // Define this API method to fetch a chapter by its ID
import { Chapter } from "@/types/chapter";
// import Editor from "@/components/editor/Editor";

import TinyMCEEditor from "@/components/editor/TinyMCE";

interface ChapterViewProps {
  params: {
    chapter: string[];
  };
}

const ChapterView: React.FC<ChapterViewProps> = ({ params }) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params && params.chapter && params.chapter.length > 0) {
      const chapterId = params.chapter;
      fetchChapter(chapterId);
    }
  }, [params]);

  const fetchChapter = async (chapterId: string) => {
    setLoading(true);
    try {
      const response = await getChapterByIdAPI(chapterId);
      setChapter(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditorChange = (content: any) => {
    console.log("content: ", content);
    if (chapter) {
      setChapter({ ...chapter, content: content });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  console.log("chapter: ", chapter?.content);
  return (
    <div className="flex flex-col md:flex-row p-2 md:p-2 md:pl-12 lg:p-6 lg:pl-12">
      <div className="flex-1 md:w-1/2 pr-4">
        <h3 className="text-2xl font-bold mb-4">{chapter?.title}</h3>
        <TinyMCEEditor
          initialValue={chapter?.content ? chapter?.content : ""}
          onEditorChange={handleEditorChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => console.log("chapter: ", chapter)}
        >
          Save
        </button>
      </div>
      <div className="flex-1 md:w-1/2 pl-4">
        <h3 className="text-2xl font-bold mb-4">Preview</h3>
        <div className="bg-gray-100 p-4 rounded">
          <h4 className="text-xl font-bold mb-2">{chapter?.title}</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: chapter?.content ? chapter?.content : "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterView;
