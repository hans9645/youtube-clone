import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [SubscribeCheck, setSubscribeCheck] = useState(false);

  useEffect(() => {
    let variable = { userTo: props.userTo };
    Axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.SubscribeNumber);
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("subscriber number를 읽는데 실패했습니다.");
      }
    });

    let subscribeCheckVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/subscribe/subscribeCheck", subscribeCheckVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribeCheck(response.data.SubscribeCheck);
        } else {
          alert("구독정보 파악에 실패했습니다.");
        }
      }
    );
  }, []);

  return (
    <div>
      <button
        style={{
          backgroundColor: `${SubscribeCheck ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: 500,
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick
      >
        {SubscribeNumber} {SubscribeCheck ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
