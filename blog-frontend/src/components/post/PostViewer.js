import React from "react";
import styled from "styled-components";
import palette from "../../lib/styles/palette";
import SubInfo from "../common/SubInfo";
import Tags from '../common/Tags'

const PostViewerBlock = styled.div`
    margin-top: 4rem;
`;

const PostHead = styled.div`
    border-bottom: 1px solid ${palette.gray[2]};
    padding-bottom: 3rem;
    margin-bottom: 3rem;
    h1 {
        font-sie: 3rem;
        line-height: 1.5;
        margin: 0;
    }
`;

const PostContent = styled.div`
    font-size: 1.3125rem;
    color: ${palette.gray[8]};
`;

const PostViewer = ({post, error, loading}) => {
    // 에러 발생 시
    if (error) {
        if (error.response && error.response.status === 404) {
            return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>
        }
        return <PostViewerBlock>오류 발생!</PostViewerBlock>
    }

    if (loading || !post) {
        return null;
    }

    const {title, body, user, publishedDate, tags} = post;

    return (
        <PostViewerBlock>
            <PostHead>
                <h1>{title}</h1>
                <SubInfo username={user.username} publishedDate={new Date(publishedDate).toLocaleDateString()}/>
                <Tags tags={tags}/>
            </PostHead>
            <PostContent
                dangerouslySetInnerHTML={{__html: body}}
            />
        </PostViewerBlock>
    );
};

export default PostViewer;