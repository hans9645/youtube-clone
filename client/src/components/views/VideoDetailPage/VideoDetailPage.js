import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.VideoDetail);
        setVideoDetail(response.data.VideoDetail);
      } else {
        alert("비디오 상세 화면을 가져오지 못했습니다.");
      }
    });
  }, []);

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
            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>

            <Comment videoId={videoId} />
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
