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
        <div className="logo">
          <img src="https://firebasestorage.googleapis.com/v0/b/arquisoft2023i.appspot.com/o/logo_no_bg-removebg-preview.png?alt=media&token=9d14cf7f-af65-4a80-a080-32e1661d85c5"/>
        </div>
        <p className="user-name-div">{user.Names}</p>
      </header>
      <div className="main-container">
        <div id="channels-div">
          <ChannelsList channels={channels} userId={user.ID} />
        </div>
        <Outlet />
      </div>
    </div>
  );
};