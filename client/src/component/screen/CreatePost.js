import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  //after change the url value we send req to server
  useEffect(() => {
    if(url){
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
          } else {
            M.toast({
              html: "Successfully posted",
              classes: "black-text #eeeeee grey lighten-3",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
  }, [url]); //when url chnages useEffect will run

  //to send file to server use new FormData
  //search upload file in link down below
  //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram-clone"); // second parameter is cloudnairy
    data.append("cloud_name", "alexyoon"); //my cloudnairy name
    fetch("https://api.cloudinary.com/v1_1/alexyoon/image/upload", {
      //append image/upload in order to post the data to store image in cloud
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
      />

      <div className="file-field input-field">
        <div className="btn #1976d2 blue darken-1">
          <span>Upload Image</span>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #1976d2 blue darken-1"
        onClick={() => postDetails()}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;
