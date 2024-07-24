export interface Chapter  {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    userId: string;
    courseId: string;
    chapterSlug: string;    
    excerpt: string;
    tags: string[];
    metaDescription: string;
    keyPhrase: string;
}