import getDataFromApi from '../apiCall';
import { getAllArticle, deleteArticle, updateArticle, createArticle } from '../constant';


export const getAllArticleAPI = async (page: number, limit: number, title?: string) => {
    // Create a copy of the request object to avoid mutating the original one
    let request: any = { ...getAllArticle };
    if(title) {
        request.url = `${getAllArticle.url}?page=${page}&limit=${limit}&title=${title}`;
    } else {
        request.url = `${getAllArticle.url}?page=${page}&limit=${limit}`;
    }
    const result: any = await getDataFromApi(request);
    return result?.data;
};


export const deleteArticleAPI = async (id: string) => {
    let request: any = { ...deleteArticle };
    request.url = `${deleteArticle.url}/${id}`;
    const result: any = await getDataFromApi(request);
    return result?.data;
}


export const updateArticleAPI = async (id: string, data: any) => {
    let request: any = { ...updateArticle };
    request.url = `${updateArticle.url}/${id}`;
    request.data = {
        title: data.title,
        content: data.content,
        description: data.description,
        slug: data.slug,
        draftStage: data.draftStage
    };
    const result: any = await getDataFromApi(request);
    return result?.data;
}


export const createArticleAPI = async (data: any) => {
    let request: any = { ...createArticle };
    request.data = data;
    const result: any = await getDataFromApi(request);
    return result?.data;
}

export const getArticleByIdAPI = async (id: string) => {
    let request: any = { ...getAllArticle };
    request.url = `${getAllArticle.url}/${id}`;
    const result: any = await getDataFromApi(request);
    return result?.data;
}