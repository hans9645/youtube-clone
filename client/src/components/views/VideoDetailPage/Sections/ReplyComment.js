import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";
function ReplyComment(props) {
  const [OpenReplyComments, setOpenReplyComments] = useState(false);
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  useEffect(() => {
    let commentNumber = 0;

    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);
  }, [props.commentLists]);

  const renderReplyment = (parentCommentId) => {
    return props.commentLists.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              key={index}
              comment={comment}
              videoId={props.videoId}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              parentCommentId={comment._id}
              commentLists={props.commentLists}
              videoId={props.videoId}
            />
          </div>
        )}
      </React.Fragment>
    ));
  };

  const onHandleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };
  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={onHandleChange}
        >
          View {ChildCommentNumber} more comment(s)
        </p>
      )}
      {OpenReplyComments && renderReplyment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
