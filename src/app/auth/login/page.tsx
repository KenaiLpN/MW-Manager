export default function LoginPage() {
  return(
  <main className="flex flex-col justify-center items-center h-screen w-screen bg-[#0D1117]">
    <div className="bg-[#090C10] h-120 w-120 rounded-2xl border border-[#222528]">

        <h1 className="flex justify-center mt-10 mb-2 text-4xl font-bold text-[#00D3F3]">Bem-Vindo</h1>
        <h2 className="flex justify-center text-[#99A1AF]">Faça login para continuar</h2>
       


        <form action="submit"
              className="flex flex-col justify-center items-center mt-10 ml-15 mr-15 gap-2">
          
          <div className="">
            <label className="text-[#D1D5DC] font-medium">Email</label>
            <input
              // {...register("email")}
              type="email"
              required
              className="border w-105 border-[#656E7D] mb-5  bg-[#0D121C] p-3 rounded-md placeholder-[#656E7D] mt-2"
              placeholder="email@exemplo.com"
              // disabled={isLoading}
            />
          </div>
          <div className="">
            <label className="text-[#D1D5DC] font-medium">Senha</label>
            <input
              // {...register("email")}
              type="password"
              required
              className="border w-105 border-[#656E7D] mb-5  bg-[#0D121C] p-3 rounded-md placeholder-[#656E7D] mt-2"
              placeholder="senha"
              // disabled={isLoading}
            />
          </div>

          <button className=" w-105 mb-5 bg-gradient-to-r from-[#00B8DB] to-[#155EFC] p-2 h-13 rounded-md hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
            <h1 className="flex justify-center font-bold text-[#F9FCFF] ">Entrar</h1>
          </button>


        </form>




    </div>
  </main>
  )
}