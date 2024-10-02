const TestiCard = ({ image, message, nick, age }: { image: string; message: string; nick: string; age: number}) => {


  return (
    <div className={`flex flex-col p-6 w-[343px] h-[286px] justify-between items-center gap-12 rounded-xl`}>
      <div className="flex flex-col items-center gap-8">
        <img src={image} alt="profile" className="h-24 w-24 rounded-full" />
        <div className="text-xl text-black font-bold w-full text-center">"{message}"</div>
        <div className="text-lg text-black text-wrap text-center">{nick}, {age}</div>
      </div>
    </div>
  );
};

export default TestiCard;
