import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";

function Comment(props) {
  const user = useSelector((state) => state.user);
  const videoId = props.videoId;
  const [commentValue, setcommentValue] = useState("");

  const handleClick = (event) => {
    setcommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoId: videoId,
    };
    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        props.refreshFunction(response.data.result);
        setcommentValue("");
      } else {
        alert("커멘트를 저장하지 못했습니다.");
      }
    });
  };
  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />
      {/*comment lists*/}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <SingleComment
                refreshFunction={props.refreshFunction}
                key={index}
                comment={comment}
                videoId={videoId}
              />
            )
        )}

      {/*Root comment Form*/}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleClick}
          value={commentValue}
          placeholder="코멘트를 작성해주세요."
        ></textarea>
        <br />
        <button style={{ width: "25%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
export default Comment;
