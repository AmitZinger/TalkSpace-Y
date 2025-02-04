import React, { useState } from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import { toast } from 'react-toastify'
import ImageSelector from './ImageSelector'
import DateTimePicker from './DateTimePicker'
import { copyToClipboard } from '../utils/copy'
import { saveImage } from '../api/images'

const ImageUpload: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [expiration, setExpiration] = useState<Date | null>(new Date());

    const handleCopy = (text: string) => {
        copyToClipboard(text)
        toast.success("Copied to clipboard!");
    }

    const handleUpload = async () => {
        if (!image)
            toast.error("No image selected.");
        else if (!expiration)
            toast.error("No expiration selected.");
        else {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("expiration", expiration.toString());

            try {
                const response = await saveImage(formData);
                toast.success(
                    <div>
                        <p>File uploaded successfully!</p>
                        <p>{response.filePath}</p>
                        <Button onClick={() => handleCopy(response.filePath)}>Copy To Clipboard</Button>
                    </div>
                );
                return response.data;
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        }
    };

    return (
        <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, mx: 'auto', boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" align="center" fontWeight="bold">Upload Image</Typography>
            <ImageSelector setImage={setImage} setImagePreview={setImagePreview} />

            {imagePreview && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <img src={imagePreview} alt="Uploaded Preview" style={{ width: "100%", maxWidth: "200px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                </Box>
            )}

            <Typography variant="h6" align="center" fontWeight="bold">Set Expiration</Typography>
            <DateTimePicker value={expiration} setValue={setExpiration} />

            <Button onClick={handleUpload} color="success" disabled={!image} variant="contained" component="label" sx={{ textTransform: 'none' }}>
                Upload
            </Button>
        </Card>
    );
};

export default ImageUpload;