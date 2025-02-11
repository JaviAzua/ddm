import Image from "next/image";

const ResponsiveLogo = () => {
  return (
    <div className="relative size-36 lg:size-64 xl:size-80">
      <Image
        src="/logo.png"
        alt="Logo DDM"
        fill
        sizes="(min-width: 800px) 400px, 300px"
        className="rounded-full object-cover"
        priority
      />
    </div>
  );
};

export default ResponsiveLogo;
