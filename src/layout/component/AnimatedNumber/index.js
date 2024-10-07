import { useSpring, animated } from "@react-spring/web";

const AnimatedNumber = ({ number }) => {
  const props = useSpring({
    from: { value: 0 },
    to: { value: number },
    config: { duration: 1000 },
  });

  return (
    <animated.div>{props.value.to((val) => Math.round(val))}</animated.div>
  );
};

export default AnimatedNumber;
