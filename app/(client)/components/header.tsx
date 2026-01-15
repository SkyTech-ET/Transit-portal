import { useRouter } from "next/navigation";

import Logo from "./logo";

const ClientHeader = () => {

  return (
    <>
      <div className="navbar w-full bg-base-100">
        {/* <div className="md:ml-60 lg:ml-60 flex w-full  navbar-start">
          <Logo />
        </div> */}

        {/* <div className="navbar-end flex gap-2 text-sm">
          <a
            className="btn btn-outline "
            onClick={() => router.push(authRoutes.login)}
          >
            Login
          </a>
          <a className="btn" onClick={() => router.push(authRoutes.signup)}>
            SignUp
          </a>
        </div> */}
      </div>
    </>
  );
};

export default ClientHeader;
