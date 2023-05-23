import { redirect, useFetcher, useLoaderData, useHistory, useNavigation, useNavigate } from "react-router-dom";
import { createMessage, getUserDisplayById, loadChannel } from "../utils/api";
import { useEffect } from "react";

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
          <img src={author.PhotoId == "1"  ? "https://cdn.iconscout.com/icon/free/png-256/free-logo-1889531-1597591.png" : author.PhotoID} />
          <p>{ author.Names }</p>
          <p>{ message.content }</p>
          {userId === message.userId && <button className="editar" type="button">Editar</button>}
          {userId === message.userId && <button className="borrar" type="button">Borrar</button>}
        </div>
      </div>
    );
  });
}

export default function Channel () {
  const { userId, channelId, messages, members } = useLoaderData();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      // Call your function here
      console.log(":c?");
      navigate(`/${userId}/${channelId}`);
    }, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div id="channel-div">
      <div className="container">
        <LoadMessages userId={userId} members={members} messages={messages} />
        <fetcher.Form method="post">
          <input type="hidden" name="channelId" value={channelId} />
          <input type="hidden" name="userId" value={userId} />
          <input type="text" name="message" placeholder="Escriba un mensaje" id="input-message" />
        </fetcher.Form>
      </div>
    </div>
  );
};