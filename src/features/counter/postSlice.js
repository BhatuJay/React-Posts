import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: true,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
      state.loading = false;
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    addPost(state, action) {
      state.posts.push(action.payload);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    updatePost(state, action) {
      const { id, data } = action.payload;
      state.posts = state.posts.map(post => post.id === id ? data : post);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    deletePost(state, action) {
      state.posts = state.posts.filter(post => post.id !== action.payload);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  },
});

export const { setPosts, addPost, updatePost, deletePost, setLoading } = postSlice.actions;
export default postSlice.reducer;