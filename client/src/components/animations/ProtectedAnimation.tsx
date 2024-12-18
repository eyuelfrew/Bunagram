import Lottie from "react-lottie";
import animationData from "../../assets/Animation - 1729783962832.json";
const ProtectedAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={defaultOptions} height={200} width={200} />;
};

export default ProtectedAnimation;
