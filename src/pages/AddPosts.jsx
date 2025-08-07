import "../pages/AddPosts.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { useDispatch } from 'react-redux';
import { addPost, updatePost } from '../features/counter/postSlice';
import { PostPreview } from "../components/PostPreview";
import { PostForm } from "../components/PostForm";

export function AddPosts({ handleAddPostsClose, editingPosts, posts }) {
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);

    const compressAndConvertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxWidth = 800; // your display width
                    const scale = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress to JPEG with quality 0.6 (can reduce more if needed)
                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
                    resolve(compressedBase64);
                };

                img.onerror = reject;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            body: '',
            image: '',
            role: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            body: Yup.string().required('Body is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            let finalImage = '';

            if (selectedImage) {
                finalImage = await compressAndConvertToBase64(selectedImage);
            } else if (editingPosts?.image) {
                finalImage = editingPosts.image;
            } else {
                const randomSeed = Math.floor(Math.random() * 1000);
                finalImage = `https://picsum.photos/seed/${randomSeed}/800/450`;
            }

            const updatedPost = {
                id: editingPosts?.id || uuidv4(),
                title: values.title.trim(),
                body: values.body.trim(),
                image: finalImage,
                role: "admin",
                createdAt: editingPosts?.createdAt || new Date().toISOString()
            };

            const updatedPosts = editingPosts
                ? posts.map((p) => (p.id === editingPosts.id ? updatedPost : p))
                : [...posts, updatedPost];

            try {
                localStorage.setItem("posts", JSON.stringify(updatedPosts));
            } catch (e) {
                if (
                    e.name === "QuotaExceededError" ||
                    e.name === "NS_ERROR_DOM_QUOTA_REACHED"
                ) {
                    toast.error("Storage quota exceeded! Please delete old posts.");
                } else {
                    toast.error("An unexpected error occurred while saving.");
                    console.error("LocalStorage error:", e);
                }
                return;
            }

            if (editingPosts) {
                dispatch(updatePost({ id: editingPosts.id, data: updatedPost }));
                toast.success("Post updated!");
            } else {
                dispatch(addPost(updatedPost));
                toast.success("Post added!");
            }
            // toast.success(editingPosts ? "Post updated!" : "Post added!");
            resetForm();
            setSelectedImage(null);

            setTimeout(() => {
                handleAddPostsClose();
            }, 1000);
        }
    });

    useEffect(() => {
        if (editingPosts) {
            formik.setValues({
                title: editingPosts.title || '',
                body: editingPosts.body || '',
                image: editingPosts.image || ''
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingPosts]);

    return (
        <div className="add-posts-modalOverlay">
            <PostPreview
                selectedImage={selectedImage}
                formik={formik}
            />

            <div className="add-posts-modal">
                <h1>{editingPosts ? "Edit Post" : "Add Post"}</h1>
                <p className="para">{editingPosts ? "Update existing post" : "Let's add a new post"}</p>

                <PostForm
                    handleAddPostsClose={handleAddPostsClose}
                    editingPosts={editingPosts}
                    setSelectedImage={setSelectedImage}
                    formik={formik}
                />
            </div>
        </div>
    );
}