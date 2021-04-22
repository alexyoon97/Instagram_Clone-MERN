import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Search_button.css'

const Search_button = () => {
  const [userFilter, setUserFilter] = useState("");
  const [userList, setUserList] = useState([]);

  const fetchUsers = (query) => {
    setUserFilter(query);

    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUserList(result.user);
        console.log(userList);
      });
  };
  return (
    <>
      <div className="input-field col s6">
        <input
          placeholder="Search by email"
          id="icon_prefix"
          type="text"
          class="validate"
          value={userFilter}
          autoComplete='off'
          onChange={(e) => fetchUsers(e.target.value)}
        />
        <i class="material-icons prefix">search</i>

      </div>
      <div className="search_result">
        {userList && userFilter.length > 0 ? (
          userList.map((user) => {
            return <Link to={'/profile/' + user._id} onClick={()=>setUserFilter('')}>{user.email}</Link>;
          })
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default Search_button;
