import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  const [myPics, setMyPics] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        setMyPics(results.mypost);
      });
  }, []);
  useEffect(() => {
    if (url) {
      fetch("/userprofilepic", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
            M.toast({
              html: "Failed to upload the picture",
              classes: "#b71c1c red darken-4",
            });
          } else {
            M.toast({
              html: "Successfully update the profile picture",
              classes: "black-text #eeeeee grey lighten-3",
            });
            dispatch({
              type: "UPDATE_PROFILE_PIC",
              payload: { userProfilePic: url },
            });
            localStorage.setItem("user", JSON.stringify(state));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]); //when url chnages useEffect will

  useEffect(() => {
    uploadProfilePic();
  }, [image]);

  const uploadProfilePic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram-clone"); // second parameter is cloudnairy
    data.append("cloud_name", "alexyoon"); //my cloudnairy name
    fetch("https://api.cloudinary.com/v1_1/alexyoon/image/upload", {
      //append image/upload in order to post the data to store the image in cloud
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
        M.toast({
          html: "Failed to upload the image",
          classes: "#b71c1c red darken-4",
        });
      });
  };

  return (
    <>
      {state ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              {console.log(state.userProfilePic)}
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                alt=""
                src={state ? state.userProfilePic : ""}
              />
            </div>
            <div>
              <h4>{state ? state.name : "-"}</h4>
              <h5>{state ? state.email : "loading"}</h5>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{myPics.length} posts</h6>
                <h6>
                  {state.followers ? state.followers.length : "0"} followers
                </h6>
                <h6>
                  {state.following ? state.following.length : "0"} following
                </h6>
              </div>
            </div>
            <div className="file-field input-field">
              <div className="btn #1976d2 blue darken-1">
                <span>Update Image</span>
                <input
                  type="file"
                  onChange={(e) => {
                    // console.log(e.target.files[0])
                    setImage(e.target.files[0]);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="gallery">
            {myPics.map((item) => {
              return (
                <img key={item._id} className="item" alt="" src={item.photo} />
              );
            })}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Profile;
