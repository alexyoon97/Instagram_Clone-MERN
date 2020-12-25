import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import {Link} from 'react-router-dom'
import { AutoInit } from "materialize-css";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    fetch("/getfollowpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setData(results.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  const deleteComment = (commentId,postId) => {
    fetch(`/deletecomment/${commentId}/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.length !== 0 ? data.map((item) => {
        return (
          <div key={item._id} className="card home-card">
            <h5>
              <Link to={item.postedBy._id !== state._id ? '/profile/' + item.postedBy._id : '/profile'} style={{padding:"5px"}}> {item.postedBy.name} </Link>
              
              {item.postedBy._id === state._id && (
                <i
                  key={item.postedBy._id}
                  className="material-icons"
                  style={{ float: "right", cursor: "pointer" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img alt="" src={item.photo} />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                  style={{
                    color: item.likes.length > 0 ? "red" : "grey",
                    cursor: "pointer",
                  }}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                  style={{
                    color: item.likes.length > 0 ? "red" : "grey",
                    cursor: "pointer",
                  }}
                >
                  favorite
                </i>
              )}

              <span>{item.likes.length} Likes</span>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>
                    {record.text}
                    {record.postedBy._id === state._id && (
                      <i
                        key={record.postedBy._id}
                        className="material-icons"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={() => deleteComment(record._id,item._id)}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); //prevent refreshing
                  makeComment(e.target[0].value, item._id); //access first input element
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      }) : <h2 className="no-post">You are following no user</h2>}
    </div>
  );
};

export default Home;
