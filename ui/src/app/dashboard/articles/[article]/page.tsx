"use client";
import React, { useEffect, useState } from "react";
import {
  getArticleByIdAPI,
  updateArticleAPI,
} from "@/services/article/article"; // Assuming both methods are exported from the same file
import { Article } from "@/types/article";
import Toast from "@/helpers/toasters";
import TinyMCEEditor from "@/components/editor/TinyMCE";
import "@/styles/article.css";

interface ArticleViewProps {
  params: {
    article: string[];
  };
}

const ArticleView: React.FC<ArticleViewProps> = ({ params }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [preview, setPreview] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);

  useEffect(() => {
    console.log("params: ", params);
    if (params && params.article && params.article.length > 0) {
      const articleId = String(params.article);
      fetchArticle(articleId);
    }
  }, [params]);

  const fetchArticle = async (chapterId: string) => {
    setLoading(true);
    try {
      const response = await getArticleByIdAPI(chapterId);
      setArticle(response.data);
      updateCounts(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };



  const handleEditorChange = (content: any) => {
    if (article) {
      setArticle({ ...article, content });
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
    if (article) {
      // Perform any necessary logic to save the article content
      try {
        const newArticle = {
          title: article.title,
          content: article.content,
          description: article.description,
          slug: article.slug,
          draftStage: false,
        };
        const response = await updateArticleAPI(article._id, newArticle);
        if (response.success) {
          Toast.successToast({
            message: "Article updated successfully",
            autoClose: 1000,
            position: "top-right",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDraftSave = async () => {
    if (article) {
      // Perform any necessary logic to save the article content
      try {
        const newArticle = {
          title: article.title,
          content: article.content,
          description: article.description,
          slug: article.slug,
          draftStage: true,
        };
        const response = await updateArticleAPI(article._id, newArticle);
        if (response.success) {
          Toast.successToast({
            message: "Article saved successfully",
            autoClose: 1000,
            position: "top-right",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (article) {
      setArticle({ ...article, [name]: value });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log("article: ", article?.content);

  return (
    <div className="p-2 md:p-4 lg:p-6 w-full">
      <div className="flex justify-end items-center mb-4 space-x-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-full transition duration-300 text-xs md:text-sm"
          onClick={handleEditorSave}
        >
          Update
        </button>
        <button onClick={handleDraftSave} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-full transition duration-300 text-xs md:text-sm">
          Draft
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-full transition duration-300 text-xs md:text-sm"
          onClick={() => setPreview(!preview)}
        >
          Preview
        </button>
      </div>
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-8">
        {article?.title}
      </h3>
      {preview ? (
        <div
          dangerouslySetInnerHTML={{
            __html: article?.content ? article?.content : "",
          }}
          className="content"
        />
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-9/12 h-full">
            <TinyMCEEditor
              initialValue={article?.content ? article?.content : ""}
              onEditorChange={handleEditorChange}
            />
          </div>
          <div className="w-full lg:w-3/12 p-4 rounded-lg shadow-md lg:ml-4 mt-4 lg:mt-0">
            <h4 className="text-md font-bold mb-2">Article Details</h4>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={article?.title || ""}
                onChange={handleDetailChange}
                className="p-2 border border-gray-300 rounded-md bg-background"
              />

              <textarea
                name="description"
                placeholder="Meta Description"
                value={article?.description || ""}
                onChange={handleDetailChange}
                className="p-2 border border-gray-300 rounded-md bg-background"
              />
              <input
                type="text"
                name="slug"
                placeholder="Article Slug"
                value={article?.slug || ""}
                onChange={handleDetailChange}
                className="p-2 border border-gray-300 rounded-md bg-background"
              />
            </div>
            <div className="mt-4 text-sm">
              Word Count: {wordCount} | Image Count: {imageCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleView;
