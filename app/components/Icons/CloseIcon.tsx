export default (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="1.63664"
        y1="12.7929"
        x2="13.6366"
        y2="0.79289"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        y1="-1"
        x2="16.9706"
        y2="-1"
        transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 12.9414 13.5)"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};
