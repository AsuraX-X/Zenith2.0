const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col h-full sm:flex-row my-50 gap-10 sm:gap-10 items-center justify-between px-8"
    >
      <div className="h-80 min-w-80 bg-gray-500 rounded-full"></div>
      <div className="text-xl gap-4 flex flex-col">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae
          ratione, quis nostrum ducimus at eaque. Corporis commodi distinctio,
          non molestiae fugiat iste ducimus doloremque, sequi maxime
          necessitatibus porro, recusandae omnis.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis
          incidunt quaerat ratione ut quas soluta dignissimos, tenetur alias
          asperiores iusto itaque distinctio aliquid. Deleniti sit accusamus
          assumenda vel voluptatibus veniam.
        </p>
      </div>
    </section>
  );
};

export default About;
