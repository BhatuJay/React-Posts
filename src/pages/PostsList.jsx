import "./PostsList.css"
import editbtn from "../assets/edit-btn.svg";
import deletebtn from "../assets/delete-btn.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Atom } from 'react-loading-indicators';

export function PostsList({ post, user, setEditingPosts, setOpenAddPosts, handleDelete }) {
    const navigate = useNavigate();
    const [atomLoading, setAtomLoading] = useState(true);
    const [atomError, setAtomError] = useState(false);

    return (
        <>
            <div key={post.id} onClick={() => navigate(`/postdetails/${post.id}`)} className="posts-card">
                {post.role === "admin" && <span className="admin-badge">Admin</span>}

                <div className="image-wrapper">
                    {atomLoading && !atomError && <div className="atom-overlay">
                        <Atom color="#61DBFB" size="medium" text="" textColor="" />
                    </div>}
                    {atomError && <div className="atom-overlay">Image failed to load</div>}
                    <img
                        className="posts-card-img"
                        src={post.image || `https://picsum.photos/800/450?random}` + post.id}
                        alt={post.title}
                        onLoad={() => setAtomLoading(false)}
                        onError={() => {
                            setAtomLoading(false);
                            setAtomError(true);
                        }}
                    />
                </div>
                <div className="posts-card-title">
                    {post.title.length > 40 ? `${post.title.slice(0, 40)}...` : post.title}
                </div>
                <div className="posts-card-body">
                    {post.body.length > 150 ? `${post.body.slice(0, 120)}...` : post.body}
                </div>
                {post.role === "admin" && user?.role === "admin" && (
                    <div className='actions'>
                        <div
                            className='edit-btn'
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingPosts(post);
                                setOpenAddPosts(true);
                            }}>
                            <img className='list-icon' src={editbtn} alt="Edit" />
                        </div>
                        <div
                            className='delete-btn'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(post.id);
                            }}>
                            <img className='list-icon' src={deletebtn} alt="Delete" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}