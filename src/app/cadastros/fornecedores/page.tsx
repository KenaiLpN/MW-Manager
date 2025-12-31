import { CadSidebar } from "@/components/cadsidebar";

export default function FornecedoresPage() {
    return (
     <div className="flex">
              <aside>
                 <CadSidebar/>
              </aside>
        <h1 className="text-[#133c86] font-bold text-2xl m-10">Fornecedores</h1>

        <form action="submit">
    <input type="text" placeholder="Nome" className="m-10 p-2 rounded bg-white"/>
        </form>
</div>
       
    
    )}
