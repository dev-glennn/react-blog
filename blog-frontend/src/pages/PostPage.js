import React from "react";
import HeaderContainer from "../containers/common/HeaderContainer";
import PostViewerContainer from "../containers/post/PostViewerContainer";
import PostList from "../components/posts/PostList";

const PostPage = () => {
    return (
        <>
            <HeaderContainer/>
            <PostList/>
        </>
    );
};

export default PostPage;