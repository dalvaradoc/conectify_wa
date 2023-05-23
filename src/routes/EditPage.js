import { redirect, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { loadChannel } from "../utils/api";
import { editMessage } from "../utils/api";

export async function loader({ params }){
  const userId = params.userId;
  const messageId = params.messageId;
  const channelId = params.channelId;

  const messages = await loadChannel(channelId);
  const mymessage = messages.filter((message) => message._id === messageId)[0];
  if (!mymessage)
    throw new Error("No content");

  const content = mymessage.content;

  return { content, userId, messageId };
}

export async function action ({ request, params }){
  const formData = await request.formData();
  const userId = formData.get("userId");
  const messageId = formData.get("messageId");
  const content = formData.get("content");

  console.log("EDITING MESSAGE");
  console.log(userId);
  console.log(messageId);
  console.log(content);

  await editMessage(userId, messageId, content);
  return redirect(`/${userId}/${params.channelId}`);
}

export default function Edit() {
  const { content, userId, messageId } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  return (
    <div id="edit-div">
      <h2>Editar Mensaje</h2>
      <fetcher.Form method="post">
        <input type="hidden" name="userId" value={userId}/>
        <input type="hidden" name="messageId" value={messageId}/>
        <textarea id="edit-textarea" name="content" defaultValue={content}></textarea>
        <div className="buttons">
          <button className="editar">Editar</button>
          <button className="cancelar" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </fetcher.Form>
    </div>
  );
}