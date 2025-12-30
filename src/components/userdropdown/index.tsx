
import { useState } from "react";
import { Dropdown } from 'primereact/dropdown';

export default function UserDropDown() {
    const [selectedUser, setSelectedUser] = useState(null);
    const users = [
        { name: 'Usuário Interno' },
        { name: 'Aprendiz' },
        { name: 'Educador/Funcionário' },
        { name: 'Parceiro' }
    ];

    return (
        <button className="flex items-center justify-center w-full bg-[#F3F4F6] rounded">
            <Dropdown 
            value={selectedUser}
             onChange={(e) => setSelectedUser(e.value)} 
             options={users} 
             optionLabel="name"
            className="text-gray-500 p-2 w-full"  
            placeholder="Selecione o perfil"
            panelClassName="bg-white border border-gray-300 shadow-lg rounded-md p-2"
            />
        </button>
    )
}
        