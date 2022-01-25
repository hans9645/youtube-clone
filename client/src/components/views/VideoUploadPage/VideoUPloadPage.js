import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";

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

function VideoUPloadPage() {
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");

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
      } else {
        alert("video upload failed.");
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
      <Form onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/*Drop zone */}
          <Dropzone onDrop={onDrop} mulriple={false} maxSize={800000000}>
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
            <img src alt></img>
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
        <Button type="primary" size="large" onClick>
          submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUPloadPage;
//rfce로 간단하게 함수형 컴포넌트 만들 수 있음.
