"use strict";
(() => {
  const button=document.getElementById("retryButton");
  const indicator=document.getElementById("diagnosticIndicator");
  const detail=document.getElementById("diagnosticDetail");
  const action=document.getElementById("diagnosticAction");
  const explanations={
    not_configured:["Chave ainda não reconhecida pela Vercel.","Confira X_BEARER_TOKEN no ambiente Production, salve e faça um novo deploy."],
    invalid_credentials:["O X não aceitou a chave configurada.","Confira se salvou o Bearer Token correto. Nunca envie a chave em capturas ou mensagens."],
    credits_required:["O X exige créditos para consultar seguidores.","Confira o saldo e os limites no X Developer Console. Não pague antes de verificar as condições."],
    access_denied:["O aplicativo do X não possui permissão suficiente.","Confira as permissões de leitura e o acesso à API no X Developer Console."],
    account_unavailable:["O perfil @realcrumb_ não foi localizado pela API.","Confira o nome da conta oficial no X."],
    rate_limited:["Limite de consultas da API do X atingido.","Aguarde a liberação do limite. Nosso contador usa cache para reduzir consultas."],
    invalid_response:["O X respondeu em um formato inesperado.","Precisaremos conferir a resposta da API no servidor."],
    timeout:["A consulta ao X demorou mais do que o limite.","Tente novamente. Pode ser um problema temporário de conexão."],
    network_error:["A função não conseguiu se conectar ao X.","Tente novamente. Pode ser uma falha de rede ou indisponibilidade da API."]
  };
  function show(title,message,next,okay=false){
    indicator.textContent=(okay?"✅ ":"⚠️ ")+title;
    indicator.className="indicator "+(okay?"ok":"error");
    detail.textContent=message;
    action.textContent=next;
  }
  async function test(){
    button.disabled=true;
    indicator.textContent="⏳ Verificando conexão...";
    indicator.className="indicator";
    detail.textContent="Consultando o contador oficial do @realcrumb_...";
    action.textContent="Aguarde a resposta da função no site.";
    try{
      const response=await fetch("/api/followers",{headers:{"Accept":"application/json"},cache:"no-store"});
      const type=response.headers.get("content-type")||"";
      if(!type.includes("application/json")){
        show("A função não retornou JSON","O endereço /api/followers retornou HTTP "+response.status+".","Isso pode indicar que a função não está publicada corretamente. Envie uma captura desta tela.");
        return;
      }
      const data=await response.json();
      if(response.ok && data.status==="ok" && Number.isSafeInteger(data.followers)){
        const n=new Intl.NumberFormat("pt-BR").format(data.followers);
        show("Conexão funcionando!",n+" seguidores verificados na conta @realcrumb_.","O contador está conectado à API oficial do X.",true);
      }else{
        const explanation=explanations[data.reason];
        const title=explanation?explanation[0]:"A consulta ainda não está disponível.";
        const next=explanation?explanation[1]:"Resposta HTTP "+response.status+". Envie uma captura desta tela para identificarmos a causa.";
        show(title,"A função respondeu com status "+response.status+" ("+(data.reason||data.status||"sem detalhe")+").",next);
      }
    }catch(e){
      show("Não foi possível alcançar a função","A página abriu, mas a solicitação ao endereço /api/followers falhou.","Confira a conexão do celular. Se o site principal funciona, envie uma captura desta tela para investigar o servidor.");
    }finally{button.disabled=false;}
  }
  button.addEventListener("click",test);
  test();
})();