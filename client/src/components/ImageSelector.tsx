import React from "react";
import { Button } from "@mui/material";

interface ImageSelectorProps {
    setImage: (image : File) => void,
    setImagePreview: Function
}

const ImageSelector = ({ setImage, setImagePreview }: ImageSelectorProps) => {
    const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <Button variant="contained" component="label" sx={{ textTransform: 'none' }}>
            Select Image
            <input type="file" hidden accept="image/*" onChange={handleImageSelection} />
        </Button>
    );
};

export default ImageSelector;