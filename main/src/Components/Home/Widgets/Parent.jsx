import React from "react";
import PostWidget from "./PostWidget"; // Adjust the import path as needed
import ProfileEdWidget from "./ProfileEdWidget"; // Adjust the import path as needed

const Parent = () => {
  return (
    <div style={{ position: 'relative' }}>
      <PostWidget post={} />
      <ProfileEdWidget onClose={} />
    </div>
  );
};

export default Parent;
