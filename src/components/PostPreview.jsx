import '../components/PostPreview.css'

export function PostPreview({ selectedImage, formik }) {
    return (
        <>
            {(selectedImage || formik.values.image) && (
                <div className="posts-card-preview">
                    <img
                        className="posts-card-preview-img"
                        src={
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : formik.values.image
                        }
                        alt="posts-card-preview"
                    />
                    <div className="posts-card-preview-title">
                        {formik.values.title || "Post title preview"}
                    </div>
                    <div className="posts-card-preview-body">
                        {(formik.values.body?.length > 150
                            ? `${formik.values.body.slice(0, 150)}...`
                            : formik.values.body) || "Post body preview"}
                    </div>
                </div>
            )}
        </>
    )
}