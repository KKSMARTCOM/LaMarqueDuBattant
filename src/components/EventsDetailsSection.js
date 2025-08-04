import React from 'react';

const contributors = [
  {
    name: "Jean Dupont",
    role: "Directeur Marketing, Marque X"
  },
  {
    name: "Marie Curie",
    role: "Responsable Événements, Marque Y"
  },
  {
    name: "Paul Martin",
    role: "Coordinateur de Projet"
  }
];

const EventsDetailsSection = () => {
  return (
    <section className="w-full min-h-screen bg-white px-6 py-12 font-sans">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Contenu principal */}
        <article className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-left">Description</h1>
            <p className="text-gray-800 text-left mb-4">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget
              vestibulum felis. Cotiun quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu
              amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
            </p>
            <p className="text-gray-800 text-left">
              Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor.
              Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In
              turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
            </p>
          </div>

          {/* Image + légende */}
          <div className="flex flex-col items-center    ">
            <div className="w-full h-60 bg-gray-300 flex items-center justify-center">
              <img src="" alt="" />
            </div>
            <p className="text-xs text-gray-500 text-left justify-start mt-1">| Image caption goes here</p>
          </div>

          {/* Blockquote */}
          <blockquote className="border-l-4 border-gray-400 pl-4 italic font-bold text-gray-700">
            “Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis.
            Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus.”
          </blockquote>

        </article>
        {/* Sidebar */}
        <aside className="space-y-10">
          {/* Contributeurs */}
          <div className="space-y-4">
            <h3 className=" text-left text-lg font-semibold">Contributeurs</h3>
            {contributors.map((person, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full">
                    <img src="" alt="" />
                </div>
                <div>
                  <p className="font-medium text-left">{person.name}</p>
                  <p className="text-sm text-left text-gray-600">{person.role}</p>
                </div>
              </div>
            ))}
          </div>

          

          {/* Partager */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-left">Partager</h3>
            <div className="flex gap-4 text-gray-600 text-xl text-center">
              <a href="#" className="text-white hover:text-gray-100">
              <svg class="w-6 h-6 text-black dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
              </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-100">
              <svg class="w-6 h-6 text-black dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
                <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
              </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-100">
              <svg class="w-6 h-6 text-black dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
              </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-100">
              <svg class="w-6 h-6 text-black dark:text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
              </svg>
              </a>
            </div>
          </div>
        </aside>

        
      </div>
    </section>
  );
};

export default EventsDetailsSection;
