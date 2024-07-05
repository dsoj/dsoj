const list = {
  url: {
    api: "http://localhost:3000/api",
  },
  path: {
    Session: {
      Login: "/session/login",
      Logout: "/session/logout",
      Status: "/session/status",
    },
    Submit: {
      Send: "/submission/submit",
      List: "/submission/list",
    },
    Problem: {
      List: "/problem/list",
      Details: "/problem/details",
    },
    Account: {
      Signup: "/account/signup",
    },
  },
};

export default list;

export function genFullUrl(path: string) {
  return list.url.api + path;
}
