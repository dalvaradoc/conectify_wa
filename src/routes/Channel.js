import { redirect, useFetcher, useLoaderData, useHistory, useNavigation, useNavigate, Outlet } from "react-router-dom";
import { createMessage, getUserDisplayById, loadChannel } from "../utils/api";
import { useEffect, useRef, useState } from "react";

export async function action({ request, params }){
  const formData = await request.formData();
  const channelId = formData.get("channelId");
  const userId = formData.get("userId");
  const message = formData.get("message");

  console.log("Form: ");
  console.log(channelId);
  console.log(userId);
  console.log(message);

  await createMessage(channelId, userId, message);

  document.getElementById("input-message").value = "";
  return redirect(`/${userId}/${channelId}`);
}

export async function loader({ params }){
  const userId = params.userId;
  const channelId = params.channelId;
  const messages = await loadChannel(channelId);
  console.log("Mensajes: ");
  console.log(messages);
  
  let members = [];
  for (const message of messages){
    if (members.filter((member) => member.ID === message.userId).length === 0){
      const user = await getUserDisplayById(message.userId);
        
      members.push(user);
    }
  }
  console.log(members);

  return { userId, channelId, messages, members };
}

function LoadMessages({ userId, members, messages }) {
  const navigate = useNavigate();

  if (!messages){
    return(
      <div></div>
    );
  }

  console.log("Members");
  console.log(members);

  return messages.map((message) => {
    const author = members.filter((member) => member.ID === message.userId)[0];
    if (!author){
      return(
        <div></div>
      );
    }
    return(
      <div className="row" key={message._id}>
        <div className="col-12">
          <div className="inner-row">
            <div className="top-message">
              <img src={author.PhotoId == "1"  ? "https://cdn.iconscout.com/icon/free/png-256/free-logo-1889531-1597591.png" : author.PhotoID} />
              <p>{ author.Names }</p>
              <p id="message-date">{ message.updated_at }</p>
              <div className="buttons-message">
                {userId === message.userId && <button className="edit" type="button" onClick={() => navigate(`/${userId}/${message.channelId}/${message._id}`)}>Editar</button>}
                {userId === message.userId && <button className="delete" type="button">Borrar</button>}
              </div>
            </div>
          </div>
          <div className="content-message">
            <p>{ message.content }</p>
          </div>
        </div>
      </div>
    );
  });
}

export default function Channel () {
  const { userId, channelId, messages, members } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  }

  useEffect(() => {
    scrollToBottom()
  }, [channelId]);

  useEffect(() => {
    const interval = setInterval(() => {
      navigate(`/${userId}/${channelId}`);
    }, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [channelId]);
  

  return (
    <div id="channel-div">
      <div className="container" id="messages-div">
        <LoadMessages userId={userId} members={members} messages={messages} />
        <div ref={messagesEndRef}></div>
      </div>
      <div id="input-message-div">
        <fetcher.Form method="post" id="message-form">
            <input type="hidden" name="channelId" value={channelId} />
            <input type="hidden" name="userId" value={userId} />
            <input type="text" name="message" placeholder="Escriba un mensaje" id="input-message" />
        </fetcher.Form>
      </div>
    </div>
  );
};