"use client"

import React, { useEffect, useState } from "react"
import { getArticleBySlugAPI } from "@/services/article/article"
import { Article } from "@/types/article"
import "@/styles/article.css"
import Link from "next/link"
import {  Clock, User, ChevronRight } from "lucide-react"

interface ArticleViewProps {
  params: {
    article: string
  }
}

const ArticleView: React.FC<ArticleViewProps> = ({ params }) => {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (params && params.article) {
      const articleSlug = params.article
      fetchArticle(articleSlug)
    }
  }, [params])

  const fetchArticle = async (slug: string) => {
    setLoading(true)
    try {
      const response = await getArticleBySlugAPI(slug)
      setArticle(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Article not found</h2>
        <button>
          <Link href="/articles">
            <span className="mr-2">←</span> Back to Articles
          </Link>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto ">
        <nav className="flex mb-4 md:mb-6 text-sm overflow-x-auto whitespace-nowrap">
          <ol className="flex items-center space-x-1 md:space-x-3">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
            <li><Link href="/articles" className="hover:text-primary transition-colors">Articles</Link></li>
            <li><ChevronRight className="h-4 w-4 flex-shrink-0" /></li>
            <li className="text-gray-400 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">{article.title}</li>
          </ol>
        </nav>


        <Link
          href="/articles"
          className="mb-4 md:mb-6  transition-colors"
        >
          <span className="mr-2">←</span> Back
        </Link>

        <article className="bg-gray-800 mt-2 rounded-lg shadow-xl p-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-400 ">
            <div className="flex items-center mb-2 sm:mb-0">
              <User className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{article.userId?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>
                {article.updatedAt !== article.createdAt
                  ? `Updated on ${formatDate(article.updatedAt)}`
                  : `Created on ${formatDate(article.createdAt)}`}
              </span>
            </div>
          </div>
        </article>
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: article.content || "",
        }}
      />
    </div>
  )
}

export default ArticleView
