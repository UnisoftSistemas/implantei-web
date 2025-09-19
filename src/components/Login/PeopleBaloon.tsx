import { Box, Image } from "@chakra-ui/react";

function PeopleBaloon({
  top,
  bottom,
  left,
  right,
  width,
  height,
  src,
  alt,
}: {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
  height?: string;
  src: string;
  alt: string;
}) {
  return (
    <Box
      position="absolute"
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      width={width}
      height={height}
      bg="rgba(255,255,255,0.15)"
      borderRadius="50%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backdropFilter="blur(10px)"
      border="2px solid rgba(255,255,255,0.2)"
      overflow="hidden"
    >
      <Image src={src} alt={alt} />
    </Box>
  );
}

export default PeopleBaloon;
