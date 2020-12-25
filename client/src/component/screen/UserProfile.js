import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true);
  const { state, dispatch } = useContext(userContext);
  const { userid } = useParams(); //use url parameter
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        setProfile(results);
      });
  }, []);

  const folloUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== result._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
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
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                alt=""
                src={userProfile.user.userProfilePic}

              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>
                  {userProfile.user.followers
                    ? userProfile.user.followers.length
                    : "0"}{" "}
                  followers
                </h6>
                <h6>
                  {userProfile.user.following
                    ? userProfile.user.following.length
                    : "0"}{" "}
                  following
                </h6>
              </div>
              {console.log(userProfile)}
              {showFollow && !userProfile.user.followers.includes(state._id) ? (
                <button
                  className="btn waves-effect waves-light #1976d2 blue darken-1"
                  onClick={() => folloUser()}
                  style={{
                    margin: "10px",
                  }}
                >
                  follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #1976d2 red darken-1"
                  onClick={() => unfollowUser()}
                  style={{
                    margin: "10px",
                  }}
                >
                  unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img key={item._id} className="item" alt="" src={item.photo} />
              );
            })}
          </div>
        </div>
      ) : (
        <h2
          style={{
            top: "0",
          }}
        ></h2>
      )}
    </>
  );
};

export default Profile;
