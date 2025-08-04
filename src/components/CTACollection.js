import getImagePath from "./getImagePath";


export default function CTACollection(){

    return (
    <section className="mt-28">
            {/* COLLECTION */}
            <div className="backdrop-blur-sm  w-full border border-gray-300  h-80 sm:h-80 flex flex-col items-center text-center bg-black bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${getImagePath('Clothing-Canyon.png', 'cover')})`,
            filter: 'grayscale(100%)', }}
            > 
            <div className="bg-black/90 h-full w-full flex flex-col items-center justify-center">
            <h3 className=" text-white text-xl sm:text-2xl md:text-3xl font-semibold mb-2">Inscrivez-vous a notre newsletter pour être informé des dernières nouveautés. </h3>
            </div>
            </div>
    </section>
    );

}