import { NavLink, Outlet, redirect, useLoaderData } from "react-router-dom";
import { addUserToChannel, getUserById, listChannels } from "../utils/api";

export async function loader({ params }){
  const user = await getUserById(params.userId);
  console.log(user);
  const channels = await listChannels();
  console.log(channels);
  return { user, channels };
}

async function becomeMember(userId, channel) {
  // await addUserToChannel(channel.id, Number(userId));
}

function ChannelsList ({ userId, channels }) {
  if (!channels){
    return (
      <div></div>
    );
  }
  return channels.map((channel) => {
    return(
      <div key={channel.id}>
        <NavLink onClick={async () => await becomeMember(userId, channel)} to={"/" + userId + "/" + channel.id} >
          <p>{ channel.name }</p>
        </NavLink>
      </div>
    );
  });
}

export default function Home() {

  const { user, channels } = useLoaderData();

  return (
    <div id="home">
      <header>
        <h1>Conectify</h1>
        <p>Aca va el logo</p>
        <p>{user.EMail}</p>
      </header>
      <div className="container">
        <div id="channels">
          <ChannelsList channels={channels} userId={user.ID} />
        </div>
        <Outlet />
      </div>
    </div>
  );
};