import { FC } from "react";
import { GridLoader } from "react-spinners";

const PageLoader: FC = () => {
  return (
    <div className="flex flex-grow items-center justify-center bg-gray-800">
      <GridLoader color="#f4f4f4" size={25} />
    </div>
  );
};

export default PageLoader;
