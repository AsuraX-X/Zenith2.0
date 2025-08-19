const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col h-full sm:flex-row pt-20 pb-10 gap-10 sm:gap-10 items-center justify-between px-8"
    >
      <div className="h-80 min-w-80 bg-gray-500 rounded-full"></div>
      <div className="text-xl gap-4 flex flex-col">
        <p>
          What started as a simple hobby for Mrs. Ester Elorm has blossomed into De Bliss Food Hub. 
          Cooking has always been her passion – a way to express creativity, show love, and bring people together. 
          With her husband as her greatest supporter hosting legendary weekend gatherings filled with friends savoring her delicious meals, 
          the countless encouragements to "open a restaurant" became reality. De Bliss is the culmination of Mrs. Ester's love, 
          her friends' encouragement, and a dream nurtured by the most important people in her life.
        </p>
      </div>
    </section>
  );
};

export default About;
