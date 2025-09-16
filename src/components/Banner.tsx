import logo from "../assets/Logo.png"

const Banner = () => {
  return (
    <header className="absolute top-0 left-0 w-screen h-[66px] flex items-center bg-[#2D3147] px-6">
  <img src={logo} alt="Logo" className="h-10 w-10 mr-3" />
  <span className="text-white font-bold text-[24px]">
    Shipnoise
  </span>
  </header>
  );
};

export default Banner;
