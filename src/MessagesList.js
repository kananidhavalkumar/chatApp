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

  var i = -1;
 
      if(messages){
        if(messages.length){
          return <>{ messages.map((e) => {
            i++;
            {
              /* var index = Math.floor(Math.random() * 10); */
            }
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
          
            if (txt.trim && txt.trim() !== "")
             { 
              return (
                <div
                  className={`message ${messageClass}`}
                  key={e.createdAt.seconds}
                >
                  <p
                    style={{
                      maxWidth: "40vw",
                      // border: "1px solid",
                      // margin: "5px",
                     
                      // borderColor: `${color[i % 10]}`,
                    }}
                  >
                  
                    {e.image ? (
                      
                      <ModalImage large={txt} alt="Image"  onerror="this.style.display='none'" ></ModalImage>
                    ) : (
                      ""
                    )}

                    {e.image ? "" : txt}
                  </p>
                  <span className={'timeCss'}>
                    {timeOf}
                  </span>
                </div>
              );
              
                     
                    
                    }
            else return "";
          })}</>
         
        }else{
          return (<h1 style={{}}>No Data Found</h1>)
        }
      }else{
        return (<h1 style={{}}>Loading...</h1> )
      }
    }

   



export default React.memo(MessagesList);
