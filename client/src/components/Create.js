import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { createAction } from "../store/asyncMethods/PostMethod";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";
export default function Create(props) {
  const { createErrors, redirect, loading } = useSelector(
    (state) => state.PostReducer
  );
  const [currentImage, setCurrentImage] = useState("Choose image");
  const [imagePreview, setImagePreview] = useState("");
  const [value, setValue] = useState("");
  const [state, setState] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [slug, setSlug] = useState("");
  const [slugButton, setSlugButton] = useState(false);

  //Post variables
  const dispatch = useDispatch();
  const {
    user: { _id, name },
  } = useSelector((state) => state.AuthReducer);

  const fileHandle = (e) => {
    if (e.target.files.length !== 0) {
      setCurrentImage(e.target.files[0].name);
      setState({
        ...state,
        [e.target.name]: e.target.files[0],
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleInput = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });

    const createSlug = e.target.value.trim().split(" ").join("-");
    setSlug(createSlug);
  };

  const slugHandle = (e) => {
    setSlugButton(true);
    setSlug(e.target.value);
  };

  const handleURL = (e) => {
    e.preventDefault();
    setSlug(slug.trim().split(" ").join("-"));
  };

  const handleDescription = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const createPost = (e) => {
    e.preventDefault();
    const { title, description, image } = state;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", value);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("slug", slug);
    formData.append("name", name);
    formData.append("id", _id);

    dispatch(createAction(formData));
  };

  useEffect(() => {
    if (redirect) {
      props.history.push("/dashboard");
    }
    if (createErrors.length !== 0) {
      createErrors.map((err) => toast.error(err.msg));
    }
  }, [createErrors, redirect]);
  return (
    <div className="create mt-10">
      <Helmet>
        <title>Create new post</title>
        <meta name="description" content="Create a new post" />
      </Helmet>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            fontSize: "14px",
          },
        }}
      />
      {!loading ? (
        <div className="container">
          <form onSubmit={createPost}>
            <div className="row ml-minus-15 mr-minus-15">
              <div className="col-6 p-15">
                <div className="card">
                  <h3 className="card__h3">Create a new post</h3>
                  <div className="group">
                    <label htmlFor="title">Post Title</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={state.title}
                      onChange={handleInput}
                      className="group__control"
                      placeholder="Post title"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="image" className="image__label">
                      {currentImage}
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={fileHandle}
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="body">Post Body</label>
                    <ReactQuill
                      theme="snow"
                      id="body"
                      placeholder="Post Body"
                      value={value}
                      onChange={setValue}
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="description">Meta Description</label>
                    <textarea
                      name="description"
                      id="description"
                      cols="30"
                      rows="10"
                      className="group__control"
                      placeholder="Description"
                      maxLength="150"
                      defaultValue={state.description}
                      onChange={handleDescription}
                    ></textarea>
                    <p className="length">
                      {state.description ? state.description.length : 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6 p-15">
                <div className="card">
                  <div className="group">
                    <label htmlFor="slug">Post URL</label>
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      value={slug}
                      onChange={slugHandle}
                      className="group__control"
                      placeholder="Post URL"
                    />
                  </div>
                  <div className="group">
                    {slugButton ? (
                      <button className="btn btn-default" onClick={handleURL}>
                        Update Slug
                      </button>
                    ) : (
                      " "
                    )}
                  </div>
                  <div className="group">
                    <div className="imagePreview">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="group">
                    <input
                      type="submit"
                      value="Create post"
                      className="btn btn-default btn-block"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
