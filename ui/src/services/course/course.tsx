
import getDataFromApi from '../apiCall';
import { getAllCourse, deleteCourse, updateCourse, createCourse } from '../constant';


export const getAllCourseAPI = async (page?: number, limit?: number, title?: string) => {
    // Create a copy of the request object to avoid mutating the original one
    let request: any = { ...getAllCourse };
    if(title) {
        request.url = `${getAllCourse.url}?page=${page}&limit=${limit}&email=${title}`;
    } else {
        request.url = `${getAllCourse.url}?page=${page}&limit=${limit}`;
    }  
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const deleteCourseAPI = async (id: string) => {
    let request: any = { ...deleteCourse };
    request.url = `${deleteCourse.url}/${id}`;
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const updateCourseAPI = async (id: string, data: any) => {
    let request: any = { ...updateCourse };
    request.url = `${updateCourse.url}/${id}`;
    request.data = {
        title: data.title,
        description: data.description
    };
    const result: any = await getDataFromApi(request);
    return result?.data;
};

export const createCourseAPI = async (data: any) => {
    let request: any = { ...createCourse };
    request.data = data;
    const result: any = await getDataFromApi(request);
    return result?.data;
}