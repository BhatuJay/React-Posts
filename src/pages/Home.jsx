import "./Home.css";
import { useEffect, useState } from "react";
import { AddPosts } from "./AddPosts";
import { PostsList } from "./PostsList";
import { useSelector, useDispatch } from 'react-redux';
import { deletePost, setPosts } from '../features/counter/postSlice';
import { useFetch } from "../hooks/useFetch";
import { DeleteToast } from "../components/DeleteToast";

export function Home() {

    const { user } = useSelector(state => state.auth);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [editingPosts, setEditingPosts] = useState(null);
    const [openAddPosts, setOpenAddPosts] = useState(false);

    const [apiPosts, apiDataLoading] = useFetch("https://jsonplaceholder.typicode.com/posts");
    const { posts, loading } = useSelector(state => state.posts);
    const combinedPosts = [...posts, ...(apiPosts?.slice(0, 5) || [])];
    const dispatch = useDispatch();

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        dispatch(setPosts(storedPosts));
    }, [dispatch]);

    const filteredPosts = combinedPosts.filter((post) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            post.body?.toLowerCase().includes(search) ||
            post.title?.toLowerCase().includes(search);

        return matchesSearch;
    });

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleAddPostsClose = () => {
        setOpenAddPosts(false);
    };

    const handleDelete = (id) => {
        DeleteToast({
            onConfirm: () => dispatch(deletePost(id))
        });
    };

    return (
        <>
            <div className="home-bg">
                <div className="heading-body">
                    <div className="postsheading-body">
                        <h3>All Posts</h3>
                    </div>
                    <div className="search-body">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search"
                            name="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    {loading && apiDataLoading ? (
                        <div className="no-posts">Loading...</div>
                    ) : selectedPosts.length === 0 ? (
                        <div className="no-posts">No Posts Added.</div>
                    ) : null}

                    <div className="posts-list">
                        {selectedPosts.map((post) => (
                            <PostsList
                                key={post.id}
                                user={user}
                                post={post}
                                setEditingPosts={setEditingPosts}
                                setOpenAddPosts={setOpenAddPosts}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>

                {selectedPosts.length > 0 && (
                    <div className="pagination">
                        <button
                            className={currentPage === 1 ? "btn-blue-disable" : "btn-blue"}
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >Previous
                        </button>
                        {currentPage}
                        <button
                            className={currentPage === totalPages ? "btn-red-disable" : "btn-red"}
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >Next
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Action Button && FAB for Add Posts */}
            {user?.role === "admin" && (
                <button
                    className={`fab ${openAddPosts ? "fab-open" : ""}`}
                    onClick=
                    {() => {
                        if (!openAddPosts) {
                            setEditingPosts(null);
                        }
                        setOpenAddPosts(!openAddPosts);
                    }}
                    aria-label={openAddPosts ? "Close Posts" : "Add Posts"}
                    title={openAddPosts ? "Close Posts" : "Add Posts"}
                >
                    <span className="fab-icon">+</span>
                </button>
            )}

            {openAddPosts && (
                <AddPosts
                    handleAddPostsClose={handleAddPostsClose}
                    editingPosts={editingPosts}
                    posts={posts}
                    setPosts={(updatedPosts) => dispatch(setPosts(updatedPosts))}
                />
            )}
        </>
    );
}

// git add .
// git commit -m ""
// git push