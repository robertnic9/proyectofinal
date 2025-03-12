import '@/styles/hero.css';


export default function HeroSection() {
  return (
    <section id="hero">
      <div className="overlay"></div>
      <div className="texto">
        <h1>
          La manera más cómoda <br />
          PARA APRENDER DESDE CASA
        </h1>
        <p className='pb-5'>¿Estás listo para aprender información como nunca?</p>

        <button className="btn-hero pt-8">
          <a href="#course">Descubre nuestros cursos</a>
        </button>
      </div>
    </section>
  );
}
