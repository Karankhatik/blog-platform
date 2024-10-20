"use client";
import React, { useEffect, useState } from "react";
import { getArticleBySlugAPI } from "@/services/article/article";
import { Article } from "@/types/article";
import "@/styles/article.css";

interface ArticleViewProps {
  params: {
    article: string; // Ensure that you are passing the slug from URL params
  };
}

const ArticleView: React.FC<ArticleViewProps> = ({ params }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("params: ", params.article);
    if (params && params.article) {
        console.log("here it is coming")
      const articleSlug = params.article;
      fetchArticle(articleSlug);
    }
  }, [params]);

  const fetchArticle = async (slug: string) => {
    setLoading(true);
    try {
      const response = await getArticleBySlugAPI(slug); 
      setArticle(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading articleth...</p>;
  }

  return (
    <div className="p-4 justify-center w-full min-h-screen">
  <h1 className="text-3xl text-white font-bold mb-4 text-center">
    {article?.title}
  </h1>
  <div
    className=""
    dangerouslySetInnerHTML={{
      __html: article?.content || "",
    }}
  />
</div>

  );
};

export default ArticleView;
