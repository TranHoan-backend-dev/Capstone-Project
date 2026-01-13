const LeftSide = () => {
  return (
    <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col items-center justify-center text-white p-6">
      <div className="mb-6 md:mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 mx-auto">
          <span className="text-3xl md:text-5xl font-bold">logo</span>
        </div>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-2">CRM</h1>
      <p className="text-base md:text-lg text-white/90">Phiên bản 1.0.0</p>
    </div>
  );
};

export default LeftSide;
