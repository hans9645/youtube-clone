import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar, Card, Typography } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);
  const { Meta } = Card;
  const { Title } = Typography;

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.VideoDetail);
        setVideoDetail(response.data.VideoDetail);
      } else {
        alert("비디오 상세 화면을 가져오지 못했습니다.");
      }
    });

    Axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
        console.log(Comments);
      } else {
        alert("코멘트 정보를 가져오는데 실패했습니다.");
      }
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  const updateDeleteComment = (deletedCommentId) => {
    //We can just refetch all of the revised comment datas from DB
    //But it is better just to change some parts that has changed from delete function

    let targetedCommentIndex;

    let newCommentList = [...Comments];

    Comments.map((comment, index) => {
      if (comment._id === deletedCommentId) {
        targetedCommentIndex = index;
      }
    });
    newCommentList[targetedCommentIndex].delete = 1;
    //newCommentList.splice(targetedCommentIndex, 1);

    setComments(newCommentList);
  };

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe userTo={VideoDetail.writer._id} />
    );
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />

            <List.Item
              actions={[
                <LikeDislikes
                  video
                  userId={localStorage.getItem("userId")}
                  videoID={videoId}
                />,
                subscribeButton,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Meta
                    bordered
                    size="small"
                    avatar={<Avatar src={VideoDetail.writer.image} />}
                    title={VideoDetail.writer.name}
                  />
                }
                title={<Title level={3}>{VideoDetail.title} </Title>}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>

            <Comment
              refreshFunction={refreshFunction}
              deleteFunction={updateDeleteComment}
              commentLists={Comments}
              videoId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return (
      <div>
        <h1>loading...</h1>
      </div>
    );
  }
}

export default VideoDetailPage;
