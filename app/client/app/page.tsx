export default function Home() {
  return (
    <div className="">
      <div className="absolute inset-0 bg-black/40 -z-10"></div>
      <video
        src="supra.mp4"
        className="absolute top-0 -z-10 h-[100vh] w-full  object-cover flex justify-center items-center"
        autoPlay
        muted
        loop
      ></video>

      <div className="mx-auto px-3 justify-start text-neutral-200 font-bold text-[60px] text-container">
        <div className="h-[75vh] ml-20 flex flex-col justify-end">
          <h1>Your car, your price</h1>

          <p className="!text-lg !font-normal !drop-shadow-md">
            Predicting prices for your used car.
          </p>
        </div>
      </div>

      <div className="mt-[120px] pt-10 text-white">aj</div>
    </div>
  );
}
