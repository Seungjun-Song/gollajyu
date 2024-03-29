// 리액트
import React from "react";

// 내 댓글 컴포넌트
import MyActivitiesCommentItem from "./MyActivitiesCommentItem";


const MyActivitiesCommented = ({ props }) => {
  // console.log("작성한 댓글:", props);
  return (
    <>
      {props.length >= 1 ? (
        props.map((item, index) => {
          return <MyActivitiesCommentItem key={index} commentItem={item} />;
        })
      ) : (
        <p className="fontsize-sm">작성한 댓글이 없습니다</p>
      )}
    </>
  );
};

export default MyActivitiesCommented;
