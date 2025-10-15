import { CadSidebar } from "@/components/cadsidebar";

export default function CadCliPage() {
  return (
    <div className="flex  w-screen h-screen">
      <aside>
        <CadSidebar />
      </aside>

        <div className="m-10 w-full">
            <h1 className="text-[#133c86] font-bold text-3xl">Clientes</h1>
               <div className="bg-[#d5deeb]  rounded flex h-150">
                 
                   <div className="flex bg-[#bacce6] h-18 m-5 rounded justify-between w-full">
                   <input type="text" placeholder="Buscar clientes" className="m-5 p-1 w-40 rounded bg-white"/>
                      
                      <div className="flex m-5 space-x-2">
                        <button className="p-1 w-40 rounded bg-white">Colunas</button>
                        <button className="p-1 w-40 rounded bg-white">Colunas</button>
                        <button className="p-1 w-40 rounded bg-white">Colunas</button>
                        </div>

                        <button className="m-5 p-1 w-40 rounded bg-white">Novo</button>

                   </div>
                 




                 
               </div>
        </div>






    </div>
  );
}
