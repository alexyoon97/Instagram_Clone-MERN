import React, { useState } from "react";

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
        <i class="material-icons prefix">search</i>
        <input
          placeholder="Search by email"
          id="icon_prefix"
          type="text"
          class="validate"
          value={userFilter}
          onChange={(e) => fetchUsers(e.target.value)}
        />
      </div>
      <div className="search_result">
        {userList || !userFilter.length == 0 ? (
          userList.map((user) => {
            return <div>{user.email}</div>;
          })
        ) : (
          <div>...loading</div>
        )}
      </div>
    </>
  );
};

export default Search_button;
