import '../components/PostForm.css'

export function PostForm(
    {
        handleAddPostsClose,
        editingPosts,
        setSelectedImage,
        formik
    }
) {
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input
                        id="image"
                        type="file"
                        className="input"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.currentTarget.files[0])}
                    />
                </div>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        className="input"
                        {...formik.getFieldProps('title')}
                        placeholder="Enter post title"
                    />
                    {formik.touched.title && formik.errors.title && (
                        <p className="register-error">{formik.errors.title}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="body">Body:</label>
                    <textarea
                        id="body"
                        className="input"
                        {...formik.getFieldProps('body')}
                        placeholder="Enter post body"
                    />
                    {formik.touched.body && formik.errors.body && (
                        <p className="register-error">{formik.errors.body}</p>
                    )}
                </div>

                <div className="add-posts-btn-grp">
                    <button type="button" className="btn-blue" onClick={handleAddPostsClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-red">
                        {editingPosts ? "Update" : "Submit"}
                    </button>
                </div>
            </form>
        </>
    )
}
