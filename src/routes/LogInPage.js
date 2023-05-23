import { redirect, useFetcher } from "react-router-dom";
import { login } from "../utils/api";
import { parseJwt } from "../utils/api";

export async function action({ request, params }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const token = await login(email, password);
  if (!token){
    console.log("Unsuccesfull");
    return redirect("/");
  }
  return redirect("/" + parseJwt(token).user_id);
}

export default function LogIn({ errorMessage }) {
  const fetcher = useFetcher();

  return (
    <div id="login">
      <div className="container">
      <h2>Login</h2>
      <fetcher.Form method="post">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </fetcher.Form>
      <p>{ errorMessage }</p>
  </div>
    </div>
  );
};