import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <React.Fragment>
      <a href="/">
        <Image width={"50"} height={"50"} alt="logo" src="/lod" />
      </a>
    </React.Fragment>
  );
};

export default Logo;
