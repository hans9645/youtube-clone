import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;
const PrivateOption = [
  { value: 0, label: "private" },
  { value: 1, label: "public" },
];
const CategoryOption = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUPloadPage(props) {
  const user = useSelector((state) => state.user);
  // 리덕스를 이용해서 state칸으로 가서 state.user 정보를 가지고 온다.
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");

  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };
  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };
  const onCategoryChange = (e) => {
    //console.log(e.currentTarget.value);
    setCategory(e.currentTarget.value);
  };
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    console.log(files.mimetype);

    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.url);

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            //성공 시 무언가 해야할 곳.
            console.log(response.data);
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("thumnail 생성에 실패했습니다.");
          }
        });
      } else {
        alert("video upload failed.!!");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        message.success("성공적으로 video upload를 했습니다.");
        setTimeout(() => {
          props.history.push("/");
        }, 2000);
      } else {
        alert("Video upload에 실패했습니다.");
      }
    });
  };
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>videoupload</Title>
      </div>
      {/* {} 중괄호 안에서는 return 을 적으신후에 렌더링하는 부분을 넣어주셔야하며
      if() 같은 조건 처리나 변수 정의같은것이 가능합니다 하지만 () 여기에서는
      렌더링하는 부분만 넣어주셔야 합니다 ~ */}
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/*Drop zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={9000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  display: "flex",
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/**thumnail */}
          <div>
            {ThumbnailPath && (
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt={"Thumbnail"}
              ></img>
            )}
          </div>
        </div>

        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange} value={Private}>
          {PrivateOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange} value={Category}>
          {CategoryOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUPloadPage;
//rfce로 간단하게 함수형 컴포넌트 만들 수 있음.
