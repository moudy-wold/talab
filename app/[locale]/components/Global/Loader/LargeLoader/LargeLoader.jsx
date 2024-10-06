import React from "react";

function LargeLoader() {
  return (
    <div className="bg-[#202b30b0] fixed top-0 left-0 w-full h-full !z-[50] flex items-center justify-center">
      <div className="bg-white p-5 rounded-xl flex items-center justify-center">
        <div className="loaders"></div>
      </div>
    </div>
  );
}

export default LargeLoader;
