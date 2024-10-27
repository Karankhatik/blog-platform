export interface Article  {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: {
        _id: string;
        name: string;
    };
    slug: string;    
    description: string;
}