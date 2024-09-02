import Lottie from "react-lottie";
import animationData from "../../public/start_chating.json";
const LottieAnimation = () => {
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

export default LottieAnimation;
