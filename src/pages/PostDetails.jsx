import "./PostDetails.css"

import { useParams, useNavigate } from "react-router-dom";
import editbtn from "../assets/edit-btn.svg";
import deletebtn from "../assets/delete-btn.svg";

import { useSelector, useDispatch } from 'react-redux';
import { deletePost } from '../features/counter/postSlice';
import { useEffect, useState } from "react";

import { setPosts } from '../features/counter/postSlice';
import { AddPosts } from "./AddPosts";
import { useFetch } from "../hooks/useFetch";
import { DeleteToast } from "../components/DeleteToast";
import { Atom } from 'react-loading-indicators';

export function PostDetails() {
    const [atomLoading, setAtomLoading] = useState(true);
    const [atomError, setAtomError] = useState(false);

    const { id } = useParams();
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [editingPosts, setEditingPosts] = useState(null);
    const handleAddPostsClose = () => {
        setOpenAddPosts(false);
    };

    const [openAddPosts, setOpenAddPosts] = useState(false);
    const [apiPosts, apiDataLoading] = useFetch("https://jsonplaceholder.typicode.com/posts");
    const { posts, loading } = useSelector(state => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        if (posts.length === 0) {
            const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
            dispatch(setPosts(storedPosts));
        }
    }, [dispatch, posts.length]);

    const combinedPosts = [...(posts || []), ...(apiPosts || [])];
    const post = combinedPosts.find(p => String(p.id) === String(id));

    if (loading && apiDataLoading) return <div className="no-post">Loading...</div>;
    if (!post && !apiPosts) return <div className="no-post">Post not found.</div>;

    return (
        <div className="home-bg">
            <div className="post-card">
                {post.role === "admin" && <span className="post-details-admin-badge">Admin</span>}
                <div className="postdetails-image-wrapper">
                    {atomLoading && !atomError && <div className="postdetails-atom-overlay">
                        <Atom color="#61DBFB" size="medium" text="" textColor="" />
                    </div>}
                    {atomError && <div className="postdetails-atom-overlay">Image failed to load</div>}
                    <img
                        className="postdetails-posts-card-img"
                        src={post.image || `https://picsum.photos/800/450?random}` + post.id}
                        alt={post.title}
                        onLoad={() => setAtomLoading(false)}
                        onError={() => {
                            setAtomLoading(false);
                            setAtomError(true);
                        }}
                    />
                </div>
                <div className="post-card-title">{post.title}</div>
                <div className="post-card-body">{post.body}</div>

                {post.role === "admin" && user?.role === "admin" && (
                    <div className="post-actions">
                        <div
                            className='edit-btn'
                            onClick={() => {
                                setEditingPosts(post);
                                setOpenAddPosts(true);
                            }}
                        ><img className='post-list-icon' src={editbtn} alt="Edit" />
                        </div>
                        <div className='delete-btn'
                            onClick={() => {
                                DeleteToast({
                                    onConfirm: () => {
                                        dispatch(deletePost(post.id));
                                        navigate('/');
                                    }
                                });
                            }}
                        ><img className='post-list-icon' src={deletebtn} alt="Delete" />
                        </div>
                    </div>
                )}
            </div>

            {openAddPosts && (
                <AddPosts
                    handleAddPostsClose={handleAddPostsClose}
                    editingPosts={editingPosts}
                    posts={posts}
                    setPosts={(updatedPosts) => dispatch(setPosts(updatedPosts))}
                />
            )}
        </div>
    );
}