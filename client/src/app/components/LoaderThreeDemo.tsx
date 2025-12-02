import React from "react";

export function LoaderThreeDemo() {
  return (
    <div className="loader" role="status" aria-label="Loading">
      <span className="sr-only">Loading</span>
      <style jsx>{`
        .loader {
          width: 2.75em;
          height: 2.75em;
          transform: rotateZ(45deg);
          color: #fff;
          position: relative;
          display: inline-block;
        }
        .loader:before,
        .loader:after {
          content: '';
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
          color: #FF3D00;
          transform: rotateY(70deg);
          animation-delay: .4s;
        }

        @keyframes spin {
          0%, 100% { box-shadow: .2em 0px 0 0px currentcolor; }
          12% { box-shadow: .2em .2em 0 0 currentcolor; }
          25% { box-shadow: 0 .2em 0 0px currentcolor; }
          37% { box-shadow: -.2em .2em 0 0 currentcolor; }
          50% { box-shadow: -.2em 0 0 0 currentcolor; }
          62% { box-shadow: -.2em -.2em 0 0 currentcolor; }
          75% { box-shadow: 0px -.2em 0 0 currentcolor; }
          87% { box-shadow: .2em -.2em 0 0 currentcolor; }
        }
      `}</style>
    </div>
  );
}
