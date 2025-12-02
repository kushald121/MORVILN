import React from "react";

type LoaderSize = "sm" | "md" | "lg";

export interface LoaderThreeProps {
  size?: LoaderSize;
  color?: string;
  className?: string;
}

const getSize = (size: LoaderSize): string => {
  switch (size) {
    case "sm":
      return "2em";
    case "lg":
      return "3em";
    case "md":
    default:
      return "2.5em";
  }
};

export const LoaderThree: React.FC<LoaderThreeProps> = ({
  size = "md",
  color = "#ffffff",
  className = "",
}) => {
  const dimension = getSize(size);

  return (
    <div
      className={`loader ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <style jsx>{`
        .loader {
          width: ${dimension};
          height: ${dimension};
          transform: rotateZ(45deg);
          color: ${color};
          position: relative;
          display: inline-block;
        }

        .loader:before,
        .loader:after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: inherit;
          height: inherit;
          border-radius: 50%;
          transform: rotateX(70deg);
          animation: 1s spin linear infinite;
        }

        .loader:after {
          color: #ff3d00;
          transform: rotateY(70deg);
          animation-delay: 0.4s;
        }

        @keyframes spin {
          0%,
          100% {
            box-shadow: 0.2em 0px 0 0px currentcolor;
          }
          12% {
            box-shadow: 0.2em 0.2em 0 0 currentcolor;
          }
          25% {
            box-shadow: 0 0.2em 0 0px currentcolor;
          }
          37% {
            box-shadow: -0.2em 0.2em 0 0 currentcolor;
          }
          50% {
            box-shadow: -0.2em 0 0 0 currentcolor;
          }
          62% {
            box-shadow: -0.2em -0.2em 0 0 currentcolor;
          }
          75% {
            box-shadow: 0px -0.2em 0 0 currentcolor;
          }
          87% {
            box-shadow: 0.2em -0.2em 0 0 currentcolor;
          }
        }
      `}</style>
    </div>
  );
};

// Backwards-compatible default export, if anything imports it as default
const Loader: React.FC = () => <LoaderThree />;

export default Loader;
