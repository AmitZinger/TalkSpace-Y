import axios from 'axios';

export const saveImage = async (formData: FormData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/v1/images`, formData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error))
            throw new Error("An error occurred while uploading the image.");
        else
            throw new Error("Unknown error occurred.");
    }
}