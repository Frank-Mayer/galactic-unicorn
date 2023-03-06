import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { If } from "./If";

export const CookieBanner = () => {
  const [show, setShow] = useState(!getCookie("cookies_ok"));

  useEffect(() => {
    setShow(!getCookie("cookies_ok"));
  }, []);

  return (
    <If condition={show}>
      <div className="cookie-banner">
        <p className="cookie-banner__content">
          We use cookies to store your access and refresh tokens for GitHub.
          This is necessary to make the GitHub API work. Your projects are
          stored in a repository on your GitHub account.
        </p>
        <button
          className="cookie-banner__button"
          onClick={() => {
            setCookie("cookies_ok", true, {});
            setShow(false);
          }}
        >
          Ok
        </button>
      </div>
    </If>
  );
};
