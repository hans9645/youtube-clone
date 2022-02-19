import React, { useState } from "react";
import { Comment, Avatar, Button, Input, message } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const onClickOpenReplyOpen = () => {
    setOpenReply(!OpenReply);
  };
  const onClickDelete = () => {
    const variables = {
      commentId: props.comment._id,
    };
    if (user.userData._id !== props.comment.writer._id) {
      return message.error("본인의 글이 아니므로 삭제할 수 없습니다.");
    }
    Axios.post("/api/comment/deleteComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.docs);
        //props.refreshFunction(response.data.result);
        message.success("성공적으로 댓글을 삭제하였습니다.");
        props.deleteFunction(variables.commentId);
      } else {
        alert("커멘트를 삭제하지 못했습니다.");
      }
    });
  };

  const actions = [
    <LikeDislikes
      userId={localStorage.getItem("userId")}
      commentId={props.comment._id}
    />,
    <span onClick={onClickOpenReplyOpen} key={"comment-basic-reply-to"}>
      Reply to
    </span>,
    <span onClick={onClickDelete} key={"comment-basic-reply-tod"}>
      delete
    </span>,
  ];
  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const variables = {
      writer: user.userData._id,
      videoId: props.videoId,
      responseTo: props.comment._id,
      content: CommentValue,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        props.refreshFunction(response.data.result);
        setCommentValue("");
        setOpenReply(false);
      } else {
        alert("커멘트를 저장하지 못했습니다.");
      }
    });
  };
  return (
    <div>
      {props.comment.delete !== 0 && (
        <Comment
          actions={[
            <LikeDislikes
              userId={localStorage.getItem("userId")}
              commentId={props.comment._id}
            />,
            <span onClick={onClickOpenReplyOpen} key={"comment-basic-reply-to"}>
              Reply to
            </span>,
          ]}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt />}
          content={<p>삭제된 댓글입니다.</p>}
        />
      )}
      {props.comment.delete === 0 && (
        <Comment
          actions={actions}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt />}
          content={<p>{props.comment.content}</p>}
        />
      )}
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해주세요."
          ></textarea>
          <br />
          <button style={{ width: "25%", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
