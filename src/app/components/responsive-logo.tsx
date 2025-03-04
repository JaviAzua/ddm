import Image from "next/image";

const ResponsiveLogo = () => {
  return (
    <div className="relative h-32 lg:h-60 xl:h-72 aspect-video">
      <Image
        src="/logo-white.png"
        alt="Logo DDM"
        fill
        sizes="(min-width: 800px) 400px, 300px"
        className=" object-contain"
        priority
      />
    </div>
  );
};

export default ResponsiveLogo;
