import getDataFromApi from '../apiCall';
import { getAllChapter, deleteChapter, updateChapter, createChapter } from '../constant';


export const getAllChaptersAPI = async (page: number, limit: number, title?: string) => {
    // Create a copy of the request object to avoid mutating the original one
    let request: any = { ...getAllChapter };
    if(title) {
        request.url = `${getAllChapter.url}?page=${page}&limit=${limit}&title=${title}`;
    } else {
        request.url = `${getAllChapter.url}?page=${page}&limit=${limit}`;
    }
    const result: any = await getDataFromApi(request);
    return result?.data;
};


export const deleteChapterAPI = async (id: string) => {
    let request: any = { ...deleteChapter };
    request.url = `${deleteChapter.url}/${id}`;
    const result: any = await getDataFromApi(request);
    return result?.data;
}


export const updateChapterAPI = async (id: string, data: any) => {
    let request: any = { ...updateChapter };
    request.url = `${updateChapter.url}/${id}`;
    request.data = {
        title: data.title,
        content: data.content,
        courseId: data.courseId
    };
    const result: any = await getDataFromApi(request);
    return result?.data;
}


export const createChapterAPI = async (data: any) => {
    let request: any = { ...createChapter };
    request.data = data;
    const result: any = await getDataFromApi(request);
    return result?.data;
}

export const getChapterByIdAPI = async (id: string) => {
    let request: any = { ...getAllChapter };
    request.url = `${getAllChapter.url}/${id}`;
    const result: any = await getDataFromApi(request);
    return result?.data;
}