
export const knowledgeBaseItems = [
  // ACESSO E AUTENTICAÇÃO
  {
    titulo: "REDEFINIR SENHA PDPJ",
    problema_descricao: "Problema de acesso ao PDPJ por bloqueio de senha",
    solucao: `Bom dia, prezado(a) Sr(a).

A nova versão do sistema PJe foi instalada.

Clique em "Esqueci Minha senha" para redefini-la, o que resultará na reversão do bloqueio. Para desbloquear o acesso, clique em "Esqueci Minha senha" para redefinir sua senha. Essa ação reverterá o bloqueio.

IMPORTANTE:
Cabe ao próprio titular da conta adotar medidas de segurança, como:
- Evitar o uso de login e senha como forma de acesso, dando preferência ao uso de certificado digital ou token, que oferecem maior segurança;
- Revisar periodicamente as configurações da conta PDPJ, para garantir que não haja autorização de acesso por credenciais básicas (usuário/senha);
- Alterar a senha imediatamente caso suspeite de uso indevido;
- Acompanhar o uso da conta, preferencialmente acessando sempre por dispositivos e redes confiáveis.

Além disso, é possível bloquear o acesso via CPF e senha em seu perfil. Para evitar novos bloqueios, no Menu Superior - Cadastro, desative a opção Acesso Utilizando CPF e senha.

Caso o erro ainda esteja ocorrendo, solicitamos que entre em contato conosco através do nosso chat no link: https://trt15.jus.br/pje/fale-conosco. Será necessário informar o número do chamado **[insira o número do chamado]** e enviar os prints do erro apresentado.`,
    categoria: "Acesso e Autenticação",
    tags: ["senha", "pdpj", "bloqueio", "acesso", "redefinir"]
  },
  {
    titulo: "SEGURANÇA ACESSO",
    problema_descricao: "Orientações sobre segurança de acesso ao sistema PJe",
    solucao: `Bom dia, prezado(a) Sr(a).

Informamos que o TRT15 não possui controle ou visibilidade sobre tentativas de acesso à conta PJe realizadas a partir de outros estados ou localidades.

IMPORTANTE:
Cabe ao próprio titular da conta adotar medidas de segurança, como:
- Evitar o uso de login e senha como forma de acesso, dando preferência ao uso de certificado digital ou token, que oferecem maior segurança;
- Revisar periodicamente as configurações da conta PDPJ, para garantir que não haja autorização de acesso por credenciais básicas (usuário/senha);
- Alterar a senha imediatamente caso suspeite de uso indevido;
- Acompanhar o uso da conta, preferencialmente acessando sempre por dispositivos e redes confiáveis.

Além disso, é possível bloquear o acesso via CPF e senha em seu perfil.`,
    categoria: "Acesso e Autenticação",
    tags: ["segurança", "acesso", "certificado", "token"]
  },
  {
    titulo: "CPF E SENHA",
    problema_descricao: "Erro ao tentar acessar com CPF e senha",
    solucao: `Bom dia, prezado(a) Sr(a).

Esse erro está ocorrendo porque o acesso está sendo feito via CPF e senha, e para acessar dessa forma é necessário PRIMEIRO acessar com seu certificado digital para SOMENTE DEPOIS se cadastrar para acesso via CPF E SENHA.

Para isso faça conforme o seguinte link: https://trt15.jus.br/pje/acesso-com-cpf-e-senha`,
    categoria: "Acesso e Autenticação",
    tags: ["cpf", "senha", "certificado", "cadastro"]
  },
  {
    titulo: "DESBLOQUEIO CPF E SENHA",
    problema_descricao: "Como desbloquear acesso por CPF e senha",
    solucao: `Bom dia, prezado(a) Sr(a).

Na página de login do sistema, clique sobre "Esqueci minha senha".

Na janela que se abrirá, informe o CPF e o e-mail informado aqui.

Será encaminhado um e-mail para este endereço com as instruções de desbloqueio.

Basta segui-las para desbloquear o acesso.`,
    categoria: "Acesso e Autenticação",
    tags: ["desbloqueio", "cpf", "senha", "email"]
  },
  
  // CERTIFICADOS DIGITAIS
  {
    titulo: "CERTIFICADO VENCIDO",
    problema_descricao: "Problemas com certificados digitais vencidos",
    solucao: `Bom dia, prezado(a) Sr(a).

Esse erro demonstra que há pelo menos um certificado vencido instalado em seu computador. Remova-o da seguinte forma: https://trt15.jus.br/pje/certificado-renovado

Verifique, por gentileza, se há certificados digitais expirados em seu token, seguindo o passo a passo disponível em: https://trt15.jus.br/pje/certificado-renovado

Após removido o certificado vencido, configure o assinador PjeOffice para ser usado com o Certificado atual.

Segue link com tutorial de configuração do assinador: https://www.pje.jus.br/wiki/index.php/PJeOffice#Vers.C3.A3o Atual:_1.0.28

Vá no Painel de Controle do Windows e selecione Opções de Internet, Conteúdo, Certificados. Ao clicar em Certificados, mande um print por gentileza.`,
    categoria: "Certificados Digitais",
    tags: ["certificado", "vencido", "token", "pjeoffice"]
  },
  {
    titulo: "CERTIFICADO NUVEM",
    problema_descricao: "Incompatibilidade com certificados digitais em nuvem",
    solucao: `Bom dia, prezado(a) Sr(a).

A versão atual dos assinadores aceitos pelo sistema PJe não é compatível com certificados digitais hospedados em nuvem.`,
    categoria: "Certificados Digitais",
    tags: ["certificado", "nuvem", "incompatibilidade", "assinador"]
  },

  // APLICATIVOS
  {
    titulo: "JTE ATUALIZADO",
    problema_descricao: "Problemas com o aplicativo JTe após atualização",
    solucao: `Bom dia, prezado(a) Sr(a).

Desinstale e instale novamente o App em seu celular. É NECESSÁRIO VALIDAR OS DADOS DE ACESSO.

Caso o problema persista e seu cadastro continue como GERAL e não PARTE, será necessário aguardar que seja liberada uma nova versão para instalação.

Importante lembrar que esse canal de atendimento trata exclusivamente do suporte técnico ao sistema PJe. O app JTe trata-se de um sistema distinto.`,
    categoria: "Aplicativos",
    tags: ["jte", "aplicativo", "celular", "validação", "dados"]
  },
  {
    titulo: "JTE",
    problema_descricao: "Dúvidas sobre o aplicativo JTe",
    solucao: `Bom dia, prezado(a) Sr(a).

Esse canal de atendimento trata exclusivamente do suporte técnico ao sistema PJe. O app JTe trata-se de um sistema distinto. Para dúvidas relacionadas a problemas de acesso devido à senha favor entrar em contato com a Vara do Trabalho correspondente. Seguem contatos das Varas: https://trt15.jus.br/contato/informacoes-das-varas.

Segue link com manual disponível em https://pje.csjt.jus.br/manual/index.php/JTe.`,
    categoria: "Aplicativos",
    tags: ["jte", "aplicativo", "manual", "varas"]
  },

  // ASSINADORES
  {
    titulo: "Pjeoffice",
    problema_descricao: "Orientações sobre o assinador PjeOffice",
    solucao: `Bom dia, prezado(a) Sr(a).

O erro ocorre quando usado o assinador Shodô, que é incompatível com a atual versão do PJe do TRT15.

Recomendamos o uso somente do assinador PjeOffice.

Para atualizar/instalar o PjeOffice: https://cnj-pje-programs.s3-sa-east-1.amazonaws.com/pje-office/PJeOffice.exe

Segue link com tutorial de configuração do assinador: https://www.pje.jus.br/wiki/index.php/PJeOffice#Vers.C3.A3o Atual:_1.0.28`,
    categoria: "Assinadores",
    tags: ["pjeoffice", "assinador", "shodo", "incompatibilidade"]
  },
  {
    titulo: "PDPJ",
    problema_descricao: "Acesso ao PJe via PDPJ",
    solucao: `Bom dia, prezado(a) Sr(a).

Para acesso ao sistema PJe do TRT15 via PDPJ é necessário o uso do assinador PjeOffice na versão 1.0.28 e clicar no botão específico para tal acesso.

Para atualizar/instalar o PjeOffice: https://cnj-pje-programs.s3-sa-east-1.amazonaws.com/pje-office/PJeOffice.exe

Segue link com tutorial de configuração do assinador: https://www.pje.jus.br/wiki/index.php/PJeOffice#Vers.C3.A3o Atual:_1.0.28`,
    categoria: "Assinadores",
    tags: ["pdpj", "pjeoffice", "versão", "acesso"]
  },

  // CADASTROS
  {
    titulo: "Regulariza cadastro",
    problema_descricao: "Regularização de cadastro de usuário",
    solucao: `Bom dia, prezado(a) Sr(a).

Cadastro regularizado. Por gentileza, feche o PJe, abra em uma nova aba e tente novamente o acesso.`,
    categoria: "Cadastros",
    tags: ["cadastro", "regularização", "acesso"]
  },
  {
    titulo: "Desbloqueia PDPJ",
    problema_descricao: "Desbloqueio de perfil PDPJ",
    solucao: `Bom dia, prezado(a) Sr(a).

Perfil desbloqueado. Por gentileza, feche o PJe, abra em uma nova aba e tente novamente o acesso.`,
    categoria: "Cadastros",
    tags: ["desbloqueio", "pdpj", "perfil"]
  },
  {
    titulo: "CADASTRO INICIAL",
    problema_descricao: "Como fazer o cadastro inicial no sistema",
    solucao: `Bom dia, prezado(a) Sr(a).

Por gentileza, usando seu CERTIFICADO DIGITAL, siga as instruções do link abaixo para se cadastrar no sistema: https://trt15.jus.br/pje/cadastramento-inicial-de-advogados

Lembrando que é recomendado somente o uso do assinador PjeOffice.

Para atualizar/instalar o PjeOffice: https://cnj-pje-programs.s3-sa-east-1.amazonaws.com/pje-office/PJeOffice.exe

Segue link com tutorial de configuração do assinador: https://www.pje.jus.br/wiki/index.php/PJeOffice#Vers.C3.A3o Atual:_1.0.28

Caso encontre dificuldades em fazer o cadastro, mesmo usando o assinador PJeOffice, solicitamos que entre em contato conosco através do nosso chat no link: https://trt15.jus.br/pje/fale-conosco.`,
    categoria: "Cadastros",
    tags: ["cadastro", "inicial", "certificado", "advogados"]
  },
  {
    titulo: "MUDANÇA DE NOME",
    problema_descricao: "Solicitação de alteração de nome no cadastro",
    solucao: `Bom dia, prezada Sra.

Para atualização de nome no sistema PJe TRT15 forneça, por gentileza, as seguintes informações:

1-) Seu CPF;
2-) O nome anterior e o nome novo, ambos completos;
3-) Cidade e estado de nascimento;
4-) Se seu cadastro já está atualizado na Receita Federal;
5-) Qual cadastro do PJe necessita ser alterado: de 1º grau, de 2º grau, ou ambos?`,
    categoria: "Cadastros",
    tags: ["alteração", "nome", "cpf", "receita federal"]
  },
  {
    titulo: "CADASTRO REALIZADO",
    problema_descricao: "Confirmação de cadastro realizado",
    solucao: `Bom dia, prezada Sra.

Cadastro realizado/atualizado, como solicitado.

Por gentileza, verifique se está correto.

Estamos à disposição!`,
    categoria: "Cadastros",
    tags: ["cadastro", "realizado", "confirmação"]
  },

  // ERROS COMUNS
  {
    titulo: "ERRO EMAIL",
    problema_descricao: "Erro relacionado a email no sistema",
    solucao: `Prezado(a) Sr(a),

Bom dia.

Caso o erro ainda esteja ocorrendo, solicitamos que entre em contato conosco através do nosso chat no link: https://trt15.jus.br/pje/fale-conosco. Será necessário informar o número do chamado **[insira o número do chamado]** e enviar os prints do erro apresentado.`,
    categoria: "Erros Comuns",
    tags: ["erro", "email", "chat", "print"]
  },
  {
    titulo: "ERRO pJE",
    problema_descricao: "Erros gerais no sistema PJe",
    solucao: `Bom dia, prezado(a) Sr(a).

Nesse momento o sistema PJe está plenamente operante.

Caso ainda esteja com dificuldades, solicitamos que entre em contato conosco através do nosso chat no link: https://trt15.jus.br/pje/fale-conosco. Será necessário informar o número do chamado **[insira o número do chamado]** e enviar os prints do erro apresentado.`,
    categoria: "Erros Comuns",
    tags: ["erro", "pje", "sistema", "operante"]
  },
  {
    titulo: "TELAS EM BRANCO",
    problema_descricao: "Problema de telas em branco no sistema",
    solucao: `Bom dia, prezado(a) Sr(a).

Por gentileza, consulte o item 5. TELAS EM BRANCO da seguinte página: https://trt15.jus.br/pje/28x`,
    categoria: "Erros Comuns",
    tags: ["telas", "branco", "visualização"]
  },

  // SUPORTE E ATENDIMENTO
  {
    titulo: "ATENDIDO PELO CHAT",
    problema_descricao: "Confirmação de atendimento via chat",
    solucao: `Bom dia, prezado(a) Sr(a).

Verificamos que seu atendimento foi concluído pelo chat.`,
    categoria: "Suporte e Atendimento",
    tags: ["atendimento", "chat", "concluído"]
  },
  {
    titulo: "ADVOGADO ENCAMINHA CHAT",
    problema_descricao: "Encaminhamento de advogado para chat",
    solucao: `Prezado(a) Sr(a),

Bom dia.

Agradecemos o seu contato.

Para que possamos dar continuidade ao seu atendimento, solicitamos que entre em contato conosco através do nosso chat no link: https://trt15.jus.br/pje/fale-conosco. Será necessário informar o número do chamado **[insira o número do chamado]** e enviar os prints do erro apresentado.`,
    categoria: "Suporte e Atendimento",
    tags: ["advogado", "chat", "atendimento", "chamado"]
  },
  {
    titulo: "PROCURADOR ENCAMINHA CHAT",
    problema_descricao: "Encaminhamento de procurador para chat",
    solucao: `Prezado(a) Sr(a),

Bom dia.

Agradecemos o seu contato.

Para que possamos dar continuidade ao cadastro, solicitamos que entre em contato conosco através do nosso chat no link: https://trt15.jus.br/pje/fale-conosco. Será necessário informar o número do chamado **[insira o número do chamado]** e enviar as respectivas portarias de nomeação/exoneração.`,
    categoria: "Suporte e Atendimento",
    tags: ["procurador", "chat", "cadastro", "portarias"]
  },

  // DOWNLOADS E ARQUIVOS
  {
    titulo: "DOWNLOAD",
    problema_descricao: "Problemas com download de documentos",
    solucao: `Bom dia, prezado(a) Sr(a).

O sistema PJe está plenamente operante e não recebemos quaisquer reclamações de outros usuários.

Neste caso, orientamos que o usuário efetue o download dos documentos individualmente.

Em algumas versões do PJe, o download da íntegra de alguns processos apresenta esse tipo de problema. Apesar de afetar a praticidade, é uma situação que não configura impeditivo de acesso, uma vez que as peças estão disponíveis para download.

Há a possibilidade também do usuário entrar em contato com a unidade onde o processo se encontra, relatando a situação, e verificando se é possível encaminhar a cópia dos autos.

Nós do setor técnico não possuímos autorização para encaminhar cópia de processos aos usuários.

Seguem contatos:
1º GRAU, ver e-mails em: https://trt15.jus.br/contato/informacoes-das-varas
2º GRAU: ver e-mails em https://trt15.jus.br/legislacao/normas-institucionais/comunicados/comunicado-gp-no-0112020

Atendimento por vídeo, Balcão virtual: https://trt15.jus.br/servicos/balcao-virtual`,
    categoria: "Downloads e Arquivos",
    tags: ["download", "documentos", "integra", "processo"]
  },

  // ASSINATURA EMAIL PADRÃO
  {
    titulo: "ASSINATURA EMAIL",
    problema_descricao: "Assinatura padrão para emails de atendimento",
    solucao: `Cordialmente,

Núcleo de Apoio ao PJe - TRT15
Atendimento telefônico: 0800-777-4344
Atendimento por chat: https://trt15.jus.br/pje/fale-conosco
Horário de atendimento: de segunda a sexta, das 12:00 às 18:00 horas.`,
    categoria: "Suporte e Atendimento",
    tags: ["assinatura", "email", "contato", "horario"]
  }
];
