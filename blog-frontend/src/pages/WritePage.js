import React from "react";
import Editor from "../components/write/Editor";
import TagBox from "../components/write/TagBox";
import Responsive from "../components/common/Responsive";
import WriteActionButtons from "../components/write/WriteActionButtons";

const WritePage = () => {
    return (
        <Responsive>
            <Editor/>
            <TagBox/>
            <WriteActionButtons/>
        </Responsive>
    );
};

export default WritePage;