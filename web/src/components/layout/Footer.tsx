'use client'

const Footer = () => (
  <footer className="w-full h-[200px] bg-[#122112] py-6 flex flex-col items-center">
    <div className="flex flex-col justify-center items-center gap-[10px] max-w-4xl mb-2 p-5 sm:flex-row sm:gap-10">
      <a href="#" className="text-[#9EBF9E] text-sm hover:underline">Política de Privacidade</a>
      <a href="#" className="text-[#9EBF9E] text-sm hover:underline">Termos de Serviço</a>
      <a href="#" className="text-[#9EBF9E] text-sm hover:underline">Contate-nos</a>
    </div>
    <div className="text-[#9EBF9E] text-xs text-center mt-2">
      ©2025 NestFin. Direitos reservados.
    </div>
  </footer>
);

export default Footer;