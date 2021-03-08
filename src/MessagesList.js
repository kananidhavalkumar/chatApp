import React, { useEffect } from "react";
import ModalImage from "react-modal-image";
import "./messageCss.css";
function MessagesList({ messages, username, simpleCrypto }) {
  var color = [
    "#FF6347",
    "#BC8F8F",
    "#5F9EA0",
    "#9ACD32",
    "#EE82EE",
    "#F0E68C",
    "#FFB6C1",
    "#98FB98",
    "#ADD8E6",
    "#D2B48C",
  ];
  useEffect(() => {
    return () => {
      var elem = document.getElementById("chatId");
      elem.scrollTop = elem.scrollHeight;
    };
  }, []);
  var i = -1;
  return (
    <>
      {messages
        ? messages.map((e) => {
            i++;

            var index = Math.floor(Math.random() * 10);
            let txt = "";
            try {
              txt = simpleCrypto.decrypt(e.text);
            } catch (e) {}

            var t = e.createdAt
              ? new Date(e.createdAt.seconds * 1000)
              : new Date();

            var timeOf =
              t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
            const messageClass = e.username === username ? "sent" : "received";

            if (txt != "")
              return (
                <div
                  className={`message ${messageClass}`}
                  key={e.createdAt.seconds}
                >
                  <p
                    style={{
                      margin: "5px",
                      maxWidth: "40vw",
                      backgroundColor: `${color[i % 10]}`,
                    }}
                  >
                  {e.image?<ModalImage
                 
                 large={txt}
                
                 alt="image"
               ></ModalImage>:""}

                    {e.image?"click to view":txt}
                  </p>
                  <span style={{ color: "gray", paddingLeft: "10px" }}>
                    {timeOf}
                  </span>
                </div>
              );
            else
              return (
                ""
                
              );
          })
        : "No Chat"}
    </>
  );
}

export default React.memo(MessagesList);
