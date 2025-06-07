
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, FileText, Database, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateTicketForm = ({ onTicketCreated, editingTicket }: { onTicketCreated?: () => void, editingTicket?: any }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    priority: "",
    environment: "",
    cpf: "",
    userName: "",
    perfil: "",
    grau: "",
    orgaoJulgador: ""
  });

  const [generatedText, setGeneratedText] = useState("");
  const [suggestedQuery, setSuggestedQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (editingTicket) {
      setFormData({
        title: editingTicket.title || "",
        type: editingTicket.type || "",
        description: editingTicket.description || "",
        priority: editingTicket.priority || "",
        environment: editingTicket.environment || "",
        cpf: editingTicket.cpf || "",
        userName: editingTicket.userName || "",
        perfil: editingTicket.perfil || "",
        grau: editingTicket.grau || "",
        orgaoJulgador: editingTicket.orgaoJulgador || ""
      });
    }
  }, [editingTicket]);

  const ticketTypes = [
    { value: "duvida", label: "Dúvida" },
    { value: "incidentes", label: "Incidentes" },
    { value: "melhorias", label: "Melhorias" }
  ];

  const environments = [
    { value: "producao", label: "Produção" },
    { value: "homologacao", label: "Homologação" },
    { value: "desenvolvimento", label: "Desenvolvimento" }
  ];

  const priorities = [
    { value: "baixa", label: "Baixa" },
    { value: "media", label: "Média" },
    { value: "alta", label: "Alta" },
    { value: "critica", label: "Crítica" }
  ];

  const perfis = [
    { value: "servidor", label: "Servidor" },
    { value: "diretor-secretaria", label: "Diretor de Secretaria" },
    { value: "magistrado", label: "Magistrado" },
    { value: "assessor", label: "Assessor" },
    { value: "perito", label: "Perito" },
    { value: "estagiario", label: "Estagiário" },
    { value: "procurador", label: "Procurador" },
    { value: "oficial-justica", label: "Oficial de Justiça" }
  ];

  const graus = [
    { value: "1grau", label: "1º Grau" },
    { value: "2grau", label: "2º Grau" }
  ];

  // Órgãos Julgadores do 1º Grau
  const orgaosJulgadores1Grau = [
    { codigo: "415", nome: "LIQ2 - Bauru" },
    { codigo: "607", nome: "Órgão Centralizador de Leilões Judiciais de Limeira" },
    { codigo: "602", nome: "Órgão Centralizador de Leilões Judiciais de Araraquara" },
    { codigo: "139", nome: "Vara do Trabalho de Ubatuba" },
    { codigo: "440", nome: "EXE1 - São José dos Campos" },
    { codigo: "447", nome: "CON1 - Araraquara" },
    { codigo: "601", nome: "Órgão Centralizador de Leilões Judiciais de Araçatuba" },
    { codigo: "1912", nome: "CCP SÃO JOSÉ DO RIO PRETO - Centro de Conciliação Pré Processual" },
    { codigo: "603", nome: "Órgão Centralizador de Leilões Judiciais de Bauru" },
    { codigo: "448", nome: "EXE1 - Araraquara" },
    { codigo: "040", nome: "Vara do Trabalho de Cruzeiro" },
    { codigo: "144", nome: "Vara do Trabalho de Pederneiras" },
    { codigo: "81", nome: "Vara do Trabalho de Matão" },
    { codigo: "900", nome: "1º Núcleo de Justiça 4.0" },
    { codigo: "095", nome: "8ª Vara do Trabalho de Campinas" },
    { codigo: "604", nome: "Órgão Centralizador de Leilões Judiciais de Campinas" },
    { codigo: "605", nome: "Órgão Centralizador de Leilões Judiciais de Franca" },
    { codigo: "442", nome: "EXE4 - São José dos Campos" },
    { codigo: "475", nome: "EXE2 - Araraquara" },
    { codigo: "449", nome: "LIQ2 - Araraquara" },
    { codigo: "1000", nome: "Posto Avançado da Justiça do Trabalho da 15ª Região" },
    { codigo: "077", nome: "Vara do Trabalho de Indaiatuba" },
    { codigo: "461", nome: "DAM - Araraquara" },
    { codigo: "443", nome: "LIQ1 - São José dos Campos" },
    { codigo: "419", nome: "CON2 - Bauru" },
    { codigo: "474", nome: "EXE1 - Bauru" },
    { codigo: "409", nome: "DIVEX - Presidente Prudente" },
    { codigo: "39", nome: "Vara do Trabalho de Capivari" },
    { codigo: "341", nome: "Assessoria de Precatórios" },
    { codigo: "437", nome: "CON2 - Jundiaí" },
    { codigo: "433", nome: "EXE1 - Jundiaí" },
    { codigo: "118", nome: "Vara do Trabalho de Itapira" },
    { codigo: "076", nome: "2ª Vara do Trabalho de Franca" },
    { codigo: "436", nome: "CON1 - Jundiaí" },
    { codigo: "446", nome: "LIQ1 - Piracicaba" },
    { codigo: "089", nome: "2ª Vara do Trabalho de Bauru" },
    { codigo: "505", nome: "LIQ2 - Presidente Prudente" },
    { codigo: "152", nome: "Vara do Trabalho de Hortolândia" },
    { codigo: "630", nome: "Juizado Especial da Infância e Adolescência de Bauru" },
    { codigo: "201", nome: "Corregedoria-Geral" },
    { codigo: "476", nome: "EXE3 - Araraquara" },
    { codigo: "462", nome: "DAM - Bauru" },
    { codigo: "111", nome: "Vara do Trabalho de Tietê" },
    { codigo: "050", nome: "Vara do Trabalho de Dracena" },
    { codigo: "108", nome: "Vara do Trabalho de São Roque" },
    { codigo: "030", nome: "Vara do Trabalho de Ourinhos" },
    { codigo: "088", nome: "Vara do Trabalho de Lorena" },
    { codigo: "148", nome: "Vara do Trabalho de Itararé" },
    { codigo: "430", nome: "EXE2 - Sorocaba" },
    { codigo: "424", nome: "EXE1 - Campinas" },
    { codigo: "094", nome: "7ª Vara do Trabalho de Campinas" },
    { codigo: "454", nome: "EXE6 - Campinas" },
    { codigo: "472", nome: "Assessoria de Execução II de Sertãozinho, Orlândia, Batatais e Franca" },
    { codigo: "067", nome: "4ª Vara do Trabalho de Ribeirão Preto" },
    { codigo: "188", nome: "5ª Vara do Trabalho de Jundiaí" },
    { codigo: "456", nome: "EXE4 - São José do Rio Preto" },
    { codigo: "431", nome: "EXE3 - Campinas" },
    { codigo: "416", nome: "LIQ1 - Campinas" },
    { codigo: "612", nome: "Órgão Centralizador de Leilões Judiciais de São José dos Campos" },
    { codigo: "414", nome: "Divisão de Execução de Taubaté" },
    { codigo: "478", nome: "LIQ2 - Campinas" },
    { codigo: "417", nome: "LIQ1 - São José do Rio Preto" },
    { codigo: "145", nome: "Vara do Trabalho de Itatiba" },
    { codigo: "1901", nome: "CCP ARARAQUARA - Centro de Conciliação Pré Processual" },
    { codigo: "085", nome: "Vara do Trabalho de Salto" },
    { codigo: "1915", nome: "CCP DE 2º GRAU - Centro de Conciliação Pré Processual" },
    { codigo: "426", nome: "EXE1 - Sorocaba" },
    { codigo: "628", nome: "CEJUSC TAUBATÉ - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "422", nome: "CON2 - Sorocaba" },
    { codigo: "418", nome: "LIQ1 - Sorocaba" },
    { codigo: "439", nome: "CON1 - São José dos Campos" },
    { codigo: "506", nome: "EXE1 - Presidente Prudente" },
    { codigo: "428", nome: "EXE5 - Campinas" },
    { codigo: "477", nome: "EXE4 - Araraquara" },
    { codigo: "463", nome: "DAM - Campinas" },
    { codigo: "104", nome: "Vara do Trabalho de Tanabi" },
    { codigo: "901", nome: "Posto Avançado da Justiça do Trabalho de Amparo em Pedreira" },
    { codigo: "010", nome: "Vara do Trabalho de Rio Claro" },
    { codigo: "107", nome: "Vara do Trabalho de Olímpia" },
    { codigo: "62", nome: "Vara do Trabalho de Lins" },
    { codigo: "049", nome: "Vara do Trabalho de Itápolis" },
    { codigo: "153", nome: "6ª Vara do Trabalho de Ribeirão Preto" },
    { codigo: "432", nome: "EXE4 - Campinas" },
    { codigo: "097", nome: "4ª Vara do Trabalho de Jundiaí" },
    { codigo: "028", nome: "1ª Vara do Trabalho de Catanduva" },
    { codigo: "24", nome: "1ª Vara do Trabalho de Jaú" },
    { codigo: "008", nome: "1ª Vara do Trabalho de São Carlos" },
    { codigo: "003", nome: "1ª Vara do Trabalho de Sorocaba" },
    { codigo: "404", nome: "DIVEX - Campinas" },
    { codigo: "624", nome: "CEJUSC FRANCA - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "441", nome: "EXE2 - São José dos Campos" },
    { codigo: "626", nome: "CEJUSC PIRACICABA - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "061", nome: "2ª Vara do Trabalho de Araçatuba" },
    { codigo: "100", nome: "2ª Vara do Trabalho de Assis" },
    { codigo: "070", nome: "2ª Vara do Trabalho de Catanduva" },
    { codigo: "120", nome: "2ª Vara do Trabalho de Jaboticabal" },
    { codigo: "55", nome: "2ª Vara do Trabalho de Jaú" },
    { codigo: "149", nome: "2ª Vara do Trabalho de Lençóis Paulista" },
    { codigo: "051", nome: "2ª Vara do Trabalho de Piracicaba" },
    { codigo: "092", nome: "5ª Vara do Trabalho de Campinas" },
    { codigo: "614", nome: "Órgão Centralizador de Leilões Judiciais de Taubaté" },
    { codigo: "143", nome: "Vara do Trabalho de Santa Cruz do Rio Pardo" },
    { codigo: "405", nome: "Divisão de Execução de Franca" },
    { codigo: "127", nome: "Vara do Trabalho de Teodoro Sampaio" },
    { codigo: "101", nome: "2ª Vara do Trabalho de Marília" },
    { codigo: "615", nome: "CEJUSC ARAÇATUBA - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "621", nome: "CEJUSC SJRIO PRETO - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "623", nome: "CEJUSC ARARAQUARA - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "403", nome: "DIVEX - Bauru" },
    { codigo: "420", nome: "CON2 - Campinas" },
    { codigo: "037", nome: "Vara do Trabalho de Fernandópolis" },
    { codigo: "035", nome: "Vara do Trabalho de São José do Rio Pardo" },
    { codigo: "069", nome: "Vara do Trabalho de Registro" },
    { codigo: "022", nome: "Vara do Trabalho de Mogi Mirim" },
    { codigo: "411", nome: "DIVEX - São José dos Campos" },
    { codigo: "135", nome: "4ª Vara do Trabalho de Sorocaba" },
    { codigo: "423", nome: "EXE2 - Bauru" },
    { codigo: "109", nome: "3ª Vara do Trabalho de Sorocaba" },
    { codigo: "7", nome: "1ª Vara do Trabalho de Americana" },
    { codigo: "015", nome: "1ª Vara do Trabalho de Franca" },
    { codigo: "464", nome: "DAM - Jundiaí" },
    { codigo: "134", nome: "Vara do Trabalho de Leme" },
    { codigo: "438", nome: "EXE2 - Campinas" },
    { codigo: "486", nome: "CON2 - Piracicaba" },
    { codigo: "620", nome: "CEJUSC SJCAMPOS - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "479", nome: "EXE2 - Piracicaba" },
    { codigo: "079", nome: "2ª Vara do Trabalho de Araraquara" },
    { codigo: "485", nome: "EXE3 - Piracicaba" },
    { codigo: "128", nome: "2ª Vara do Trabalho de Limeira" },
    { codigo: "115", nome: "2ª Vara do Trabalho de Presidente Prudente" },
    { codigo: "042", nome: "2ª Vara do Trabalho de Ribeirão Preto" },
    { codigo: "093", nome: "6ª Vara do Trabalho de Campinas" },
    { codigo: "053", nome: "4ª Vara do Trabalho de Campinas" },
    { codigo: "412", nome: "DIVEX - São José do Rio Preto" },
    { codigo: "021", nome: "2ª Vara do Trabalho de Jundiaí" },
    { codigo: "625", nome: "CEJUSC LIMEIRA - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "413", nome: "DIVEX - Sorocaba" },
    { codigo: "014", nome: "1ª Vara do Trabalho de Limeira" },
    { codigo: "4710", nome: "PARA USO POSTERIOR" },
    { codigo: "064", nome: "Vara do Trabalho de Itanhaém" },
    { codigo: "138", nome: "2ª Vara do Trabalho de Jacareí" },
    { codigo: "507", nome: "EXE2 - Presidente Prudente" },
    { codigo: "126", nome: "2ª Vara do Trabalho de Paulínia" },
    { codigo: "401", nome: "Divisão de Execução de Araçatuba" },
    { codigo: "407", nome: "Divisão de Execução de Limeira" },
    { codigo: "057", nome: "Vara do Trabalho de Presidente Venceslau" },
    { codigo: "495", nome: "CON1 - Campinas" },
    { codigo: "480", nome: "EXE4 - Piracicaba" },
    { codigo: "122", nome: "Vara do Trabalho de Sumaré" },
    { codigo: "063", nome: "Vara do Trabalho de Caraguatatuba" },
    { codigo: "465", nome: "DAM - Piracicaba" },
    { codigo: "483", nome: "EXE4 - Sorocaba" },
    { codigo: "508", nome: "EXE3 - Presidente Prudente" },
    { codigo: "041", nome: "Vara do Trabalho de Itapetininga" },
    { codigo: "071", nome: "Vara do Trabalho de Mogi Guaçu" },
    { codigo: "110", nome: "Vara do Trabalho de José Bonifácio" },
    { codigo: "047", nome: "Vara do Trabalho de Itapeva" },
    { codigo: "132", nome: "5ª Vara do Trabalho de São José dos Campos" },
    { codigo: "084", nome: "4ª Vara do Trabalho de São José dos Campos" },
    { codigo: "091", nome: "4ª Vara do Trabalho de Bauru" },
    { codigo: "019", nome: "1ª Vara do Trabalho de Araçatuba" },
    { codigo: "029", nome: "1ª Vara do Trabalho de Jaboticabal" },
    { codigo: "087", nome: "1ª Vara do Trabalho de Paulínia" },
    { codigo: "99", nome: "2ª Vara do Trabalho de Americana" },
    { codigo: "902", nome: "Posto Avançado da Justiça do Trabalho de Andradina em Pereira Barreto" },
    { codigo: "026", nome: "1ª Vara do Trabalho de Presidente Prudente" },
    { codigo: "905", nome: "Posto Avançado da Justiça do Trabalho de Jundiaí em Vinhedo" },
    { codigo: "908", nome: "Posto Avançado da Justiça do Trabalho de Pindamonhangaba em Campos do Jordão" },
    { codigo: "471", nome: "Assessoria de Execução I de Sertãozinho, Orlândia, Batatais e Franca" },
    { codigo: "622", nome: "CEJUSC SOROCABA - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "629", nome: "Juizado Especial da Infância e Adolescência de Araçatuba" },
    { codigo: "632", nome: "Juizado Especial da Infância e Adolescência de Fernandópolis" },
    { codigo: "633", nome: "Juizado Especial da Infância e Adolescência de Franca" },
    { codigo: "635", nome: "Juizado Especial da Infância e Adolescência de Ribeirão Preto" },
    { codigo: "434", nome: "EXE2 - Jundiaí" },
    { codigo: "090", nome: "3ª Vara do Trabalho de Bauru" },
    { codigo: "096", nome: "3ª Vara do Trabalho de Jundiaí" },
    { codigo: "137", nome: "3ª Vara do Trabalho de Piracicaba" },
    { codigo: "1903", nome: "CCP BAURU - Centro de Conciliação Pré Processual" },
    { codigo: "46", nome: "Vara do Trabalho de Araras" },
    { codigo: "1906", nome: "CCP JUNDIAÍ - Centro de Conciliação Pré Processual" },
    { codigo: "002", nome: "1ª Vara do Trabalho de Jundiaí" },
    { codigo: "490", nome: "CON2 - Araraquara" },
    { codigo: "1913", nome: "CCP SÃO JOSÉ DOS CAMPOS - Centro de Conciliação Pré Processual" },
    { codigo: "427", nome: "EXE4 - Bauru" },
    { codigo: "617", nome: "CEJUSC CAMPINAS - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "636", nome: "Juizado Especial da Infância e Adolescência de Sorocaba" },
    { codigo: "496", nome: "LIQ2 - Jundiaí" },
    { codigo: "408", nome: "DIVEX - Piracicaba" },
    { codigo: "466", nome: "DAM - Ribeirão Preto" },
    { codigo: "410", nome: "DIVEX - Ribeirão Preto" },
    { codigo: "421", nome: "CON2 - São José do Rio Preto" },
    { codigo: "487", nome: "EXE3 - Sorocaba" },
    { codigo: "509", nome: "EXE4 - Presidente Prudente" },
    { codigo: "027", nome: "Vara do Trabalho de Votuporanga" },
    { codigo: "451", nome: "LIQ1 - Ribeirão Preto" },
    { codigo: "606", nome: "Órgão Centralizador de Leilões Judiciais de Jundiaí" },
    { codigo: "406", nome: "DIVEX - Jundiaí" },
    { codigo: "017", nome: "1ª Vara do Trabalho de São José do Rio Preto" },
    { codigo: "013", nome: "1ª Vara do Trabalho de São José dos Campos" },
    { codigo: "032", nome: "2ª Vara do Trabalho de Campinas" },
    { codigo: "060", nome: "Vara do Trabalho de Amparo" },
    { codigo: "1902", nome: "CCP ARAÇATUBA - Centro de Conciliação Pré Processual" },
    { codigo: "1914", nome: "CCP TAUBATÉ - Centro de Conciliação Pré Processual" },
    { codigo: "31", nome: "Vara do Trabalho de Avaré" },
    { codigo: "065", nome: "Vara do Trabalho de Tupã" },
    { codigo: "072", nome: "Vara do Trabalho de Rancharia" },
    { codigo: "618", nome: "CEJUSC PRESIDENTE PRUDENTE - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "637", nome: "Juizado Especial da Infância e Adolescência de São José do Rio Preto" },
    { codigo: "491", nome: "LIQ1 - Araraquara" },
    { codigo: "435", nome: "LIQ1 - Jundiaí" },
    { codigo: "458", nome: "EXE1 - Ribeirão Preto" },
    { codigo: "467", nome: "DAM - São José do Rio Preto" },
    { codigo: "481", nome: "CON1 - São José do Rio Preto" },
    { codigo: "425", nome: "EXE1 - São José do Rio Preto" },
    { codigo: "488", nome: "LIQ2 - Sorocaba" },
    { codigo: "510", nome: "DAM - Presidente Prudente" },
    { codigo: "609", nome: "Órgão Centralizador de Leilões Judiciais de Presidente Prudente" },
    { codigo: "075", nome: "Vara do Trabalho de Batatais" },
    { codigo: "1904", nome: "CCP CAMPINAS - Centro de Conciliação Pré Processual" },
    { codigo: "56", nome: "Vara do Trabalho de Andradina" },
    { codigo: "059", nome: "Vara do Trabalho de Pindamonhangaba" },
    { codigo: "025", nome: "Vara do Trabalho de Botucatu" },
    { codigo: "009", nome: "1ª Vara do Trabalho de Taubaté" },
    { codigo: "147", nome: "Vara do Trabalho de Aparecida" },
    { codigo: "119", nome: "Vara do Trabalho de Caçapava" },
    { codigo: "140", nome: "Vara do Trabalho de Atibaia" },
    { codigo: "492", nome: "CON1 - Bauru" },
    { codigo: "616", nome: "CEJUSC BAURU - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "634", nome: "Juizado Especial da Infância e Adolescência de Presidente Prudente" },
    { codigo: "638", nome: "Juizado Especial da Infância e Adolescência de São José dos Campos" },
    { codigo: "444", nome: "CON1 - Piracicaba" },
    { codigo: "497", nome: "EXE3 - Jundiaí" },
    { codigo: "459", nome: "EXE2 - Ribeirão Preto" },
    { codigo: "453", nome: "EXE2 - São José do Rio Preto" },
    { codigo: "482", nome: "LIQ2 - São José do Rio Preto" },
    { codigo: "058", nome: "Vara do Trabalho de Bebedouro" },
    { codigo: "489", nome: "CON1 - Sorocaba" },
    { codigo: "468", nome: "DAM - São José dos Campos" },
    { codigo: "511", nome: "DIVEX_ - Presidente Prudente" },
    { codigo: "103", nome: "3ª Vara do Trabalho de Araçatuba" },
    { codigo: "151", nome: "3ª Vara do Trabalho de Araraquara" },
    { codigo: "130", nome: "11ª Vara do Trabalho de Campinas" },
    { codigo: "043", nome: "3ª Vara do Trabalho de Campinas" },
    { codigo: "610", nome: "Órgão Centralizador de Leilões Judiciais de Ribeirão Preto" },
    { codigo: "469", nome: "Divisão de Apoio aos Magistrados de Sertãozinho" },
    { codigo: "1905", nome: "CCP FRANCA - Centro de Conciliação Pré Processual" },
    { codigo: "001", nome: "1ª Vara do Trabalho de Campinas" },
    { codigo: "006", nome: "1ª Vara do Trabalho de Araraquara" },
    { codigo: "131", nome: "12ª Vara do Trabalho de Campinas" },
    { codigo: "631", nome: "Juizado Especial da Infância e Adolescência de Campinas" },
    { codigo: "493", nome: "LIQ1 - Bauru" },
    { codigo: "498", nome: "EXE4 - Jundiaí" },
    { codigo: "445", nome: "EXE1 - Piracicaba" },
    { codigo: "068", nome: "Vara do Trabalho de Adamantina" },
    { codigo: "460", nome: "EXE4 - Ribeirão Preto" },
    { codigo: "429", nome: "EXE3 - São José do Rio Preto" },
    { codigo: "073", nome: "Vara do Trabalho de Birigui" },
    { codigo: "105", nome: "Vara do Trabalho de Campo Limpo Paulista" },
    { codigo: "613", nome: "Órgão Centralizador de Leilões Judiciais de Sorocaba" },
    { codigo: "5100", nome: "(DESATIVADO - NÃO TRAMITAR) 1º Grau - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "038", nome: "Vara do Trabalho de Bragança Paulista" },
    { codigo: "112", nome: "Vara do Trabalho de Cajuru" },
    { codigo: "123", nome: "Vara do Trabalho de Capão Bonito" },
    { codigo: "116", nome: "Vara do Trabalho de Tatuí" },
    { codigo: "142", nome: "Vara do Trabalho de Taquaritinga" },
    { codigo: "098", nome: "Vara do Trabalho de Garça" },
    { codigo: "117", nome: "Vara do Trabalho de São Joaquim da Barra" },
    { codigo: "1907", nome: "CCP LIMEIRA - Centro de Conciliação Pré Processual" },
    { codigo: "494", nome: "EXE3 - Bauru" },
    { codigo: "136", nome: "Vara do Trabalho de Pirassununga" },
    { codigo: "903", nome: "Posto Avançado da Justiça do Trabalho de Araraquara em Américo Brasiliense" },
    { codigo: "910", nome: "Posto Avançado da Justiça do Trabalho de Campinas em Valinhos" },
    { codigo: "904", nome: "Justiça Itinerante/Posto Avançado da Justiça do Trabalho de Ituverava em Igarapava" },
    { codigo: "608", nome: "Órgão Centralizador de Leilões Judiciais de Piracicaba" },
    { codigo: "906", nome: "Posto Avançado da Justiça do Trabalho de Orlândia em Morro Agudo" },
    { codigo: "907", nome: "Posto Avançado da Justiça do Trabalho de Pederneiras em Bariri" },
    { codigo: "909", nome: "Posto Avançado da Justiça do Trabalho de São João da Boa Vista em Espírito Santo Do Pinhal" },
    { codigo: "011", nome: "Vara do Trabalho de Barretos" },
    { codigo: "1908", nome: "CCP PIRACICABA - Centro de Conciliação Pré Processual" },
    { codigo: "1909", nome: "CCP PRESIDENTE PRUDENTE - Centro de Conciliação Pré Processual" },
    { codigo: "005", nome: "1ª Vara do Trabalho de Bauru" },
    { codigo: "473", nome: "EXE3 - Ribeirão Preto" },
    { codigo: "1910", nome: "CCP RIBEIRÃO PRETO - Centro de Conciliação Pré Processual" },
    { codigo: "1911", nome: "CCP SOROCABA - Centro de Conciliação Pré Processual" },
    { codigo: "012", nome: "1ª Vara do Trabalho de Piracicaba" },
    { codigo: "470", nome: "DAM - Sorocaba" },
    { codigo: "499", nome: "CON2 - São José dos Campos" },
    { codigo: "502", nome: "CON1 - Presidente Prudente" },
    { codigo: "113", nome: "5ª Vara do Trabalho de Ribeirão Preto" },
    { codigo: "611", nome: "Órgão Centralizador de Leilões Judiciais de São José do Rio Preto" },
    { codigo: "150", nome: "Vara do Trabalho de Cravinhos" },
    { codigo: "004", nome: "1ª Vara do Trabalho de Ribeirão Preto" },
    { codigo: "020", nome: "Vara do Trabalho de Guaratinguetá" },
    { codigo: "121", nome: "Vara do Trabalho de São Sebastião" },
    { codigo: "146", nome: "Vara do Trabalho de Orlândia" },
    { codigo: "048", nome: "Vara do Trabalho de Porto Ferreira" },
    { codigo: "78", nome: "Vara do Trabalho de Piedade" },
    { codigo: "124", nome: "Vara do Trabalho de Penápolis" },
    { codigo: "141", nome: "Vara do Trabalho de Mococa" },
    { codigo: "080", nome: "Vara do Trabalho de Jales" },
    { codigo: "018", nome: "Vara do Trabalho de Itu" },
    { codigo: "129", nome: "10ª Vara do Trabalho de Campinas" },
    { codigo: "114", nome: "9ª Vara do Trabalho de Campinas" },
    { codigo: "052", nome: "Vara do Trabalho de Ituverava" },
    { codigo: "133", nome: "4ª Vara do Trabalho de São José do Rio Preto" },
    { codigo: "036", nome: "1ª Vara do Trabalho de Assis" },
    { codigo: "023", nome: "1ª Vara do Trabalho de Jacareí" },
    { codigo: "074", nome: "1ª Vara do Trabalho de Lençóis Paulista" },
    { codigo: "033", nome: "1ª Vara do Trabalho de Marília" },
    { codigo: "402", nome: "DIVEX - Araraquara" },
    { codigo: "484", nome: "LIQ2 - Piracicaba" },
    { codigo: "054", nome: "1ª Vara do Trabalho de Sertãozinho" },
    { codigo: "034", nome: "Vara do Trabalho de São João da Boa Vista" },
    { codigo: "86", nome: "Vara do Trabalho de Santa Bárbara D'Oeste" },
    { codigo: "083", nome: "3ª Vara do Trabalho de São José dos Campos" },
    { codigo: "450", nome: "CON2 - Ribeirão Preto" },
    { codigo: "500", nome: "EXE3 - São José dos Campos" },
    { codigo: "619", nome: "CEJUSC RIBEIRÃO PRETO - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "627", nome: "CEJUSC JUNDIAÍ - JT Centro Judiciário de Métodos Consensuais de Solução de Disputas da Justiça do Trabalho" },
    { codigo: "503", nome: "CON2 - Presidente Prudente" },
    { codigo: "106", nome: "2ª Vara do Trabalho de São Carlos" },
    { codigo: "044", nome: "2ª Vara do Trabalho de São José do Rio Preto" },
    { codigo: "045", nome: "2ª Vara do Trabalho de São José dos Campos" },
    { codigo: "016", nome: "2ª Vara do Trabalho de Sorocaba" },
    { codigo: "082", nome: "3ª Vara do Trabalho de São José do Rio Preto" },
    { codigo: "066", nome: "3ª Vara do Trabalho de Ribeirão Preto" },
    { codigo: "457", nome: "CON1 - Ribeirão Preto" },
    { codigo: "125", nome: "2ª Vara do Trabalho de Sertãozinho" },
    { codigo: "102", nome: "2ª Vara do Trabalho de Taubaté" },
    { codigo: "455", nome: "LIQ2 - Ribeirão Preto" },
    { codigo: "501", nome: "LIQ2 - São José dos Campos" },
    { codigo: "504", nome: "LIQ1 - Presidente Prudente" }
  ];

  // Assuntos dos chamados padronizados
  const availableTemplates = [
    "Acesso ao Sistema – Erro ao Carregar Painel",
    "Acórdão – Erro",
    "Acumulador – Consulta de Posição",
    "Acumulador – Regularização",
    "Advogado – Painel do Advogado / Procurador – Erro",
    "Agrupadores – Erro",
    "Área de Zoneamento – Erro em Configuração do Oficial de Justiça",
    "Assinador não Carrega – Não ativa o botão \"Entrar\"",
    "Assinatura de Acórdão – Erro",
    "Assinatura de Ata – Erro",
    "Assuntos da Ação – Competência",
    "Assuntos da Ação – Inexistência",
    "Ata de Audiência – Erro de Assinatura",
    "Ata de Audiência – Erro na Confirmação",
    "Ata de Audiência – Erro na Exportação",
    "Atualização de Tela",
    "Audiência – Pauta – Erro de Designação",
    "Audiências – Erro ao Abrir Pauta",
    "Audiências – Erro Configuração de Sala",
    "Audiências – Pauta Bloqueada – Marcação de Horário",
    "Autenticação: Erro ao Consultar Dados",
    "Autenticação: Não foi Possível Realizar",
    "Atuação – Correção de Parte",
    "Atuação – Erro ao Alterar a Classe",
    "Baixa ao 1º Grau – Erro",
    "Baixa de Documentos – Erro Webservice",
    "Baixa para diligência – Erro",
    "BNDT – Erro na Inclusão ou Exclusão",
    "Cadastro de Advogado – Erro",
    "Cadastro de Autoridade",
    "Cadastro de Magistrado – Alteração",
    "Cadastro de Órgãos Públicos",
    "Cadastro de Perito – Erro",
    "Cadastro de Pessoa Física – Atualização de Nome",
    "Cadastro de Pessoa Física – Erro",
    "Cadastro de Pessoa Jurídica – Erro",
    "Cadastro de Processo CLE – Erro na Elaboração",
    "Cadastro de Procurador – Erro",
    "Cadastro de Usuário – Correção de Perfil",
    "Cadastro de Usuário – Exclusão de Perfil",
    "Calendário",
    "Caixas das Árvores de Tarefa – Erro na listagem",
    "CEP – Registro Ausente",
    "CEP Inexistente na Base dos Correios – Não Encontrado",
    "Certidão de Distribuição de Ações Trabalhistas",
    "Competência – Classe × Assunto",
    "Competência – Órgão Julgador × Competência",
    "Configuração de Órgão Julgador",
    "Configuração do Sistema – Alteração, Inclusão ou Exclusão",
    "Consulta – Alertas em Processos – Erro",
    "Consulta Características / Recursos do Sistema",
    "Consulta de Processos",
    "Controle de prazos – Erro",
    "Decisão / Despacho – Erro na Assinatura",
    "Defeito em Homologação",
    "Defeito em Produção",
    "Descrição de Tipo de Parte – Erro – Classe Judicial",
    "Distribuição de Processos – Erro",
    "Documento – Sem Conteúdo",
    "Documento do Processo – Erro ao Abrir",
    "Documento do Processo – Erro ao Salvar",
    "Documento do Processo – Erro em Assinatura",
    "Documento do Processo – Erro no Escaninho",
    "Documento do Processo – Sem Assinatura",
    "Documento do Processo – Sem Data de Juntada",
    "Documentos – Aba Anexar Documentos – Tipos",
    "Documentos – Anexos – Sem Vinculação com o Principal",
    "Documentos – Exclusão",
    "Documentos do Processo – Erro ao Baixar",
    "Documentos do Processo – Erro na Atualização",
    "Documentos do Processo – Erro no Tipo – Despacho",
    "E-Rec – Configuração – Erro",
    "EXE-Pje – Erro de Execução",
    "GIGS – Erro",
    "Habilitação Advogado – Erro",
    "Inclusão de CEP",
    "JIRA 1º grau – Consulta de Mensagens",
    "JIRA 1º grau – Postar Mensagem",
    "JIRA 2º grau – Consulta de Mensagens",
    "JIRA 2º grau – Postar Mensagem",
    "Logs do Sistema – Solicitação",
    "MNI – Erro na Assinatura de Documentos",
    "Modelos de Documentos – Erro na Exibição / Seleção",
    "Movimento – Erro no Registro",
    "Nó de Desvio – Erro na Inclusão de Processo",
    "Nó de Desvio – Inexistência de Fluxo",
    "Painel KZ – Filtros",
    "Pauta de Julgamento – Fechamento – Erro",
    "Pauta de Julgamento – Inclusão de Processos – Erro",
    "Pje – Cadastro de usuários (Alteração ou Cadastramento de Localização, Visibilidade e Papel)",
    "Pje-Calc – Erro na Execução",
    "Pje-JT – BugFix 1º grau – Atualização",
    "Pje-JT – BugFix 2º grau – Atualização",
    "Pje-JT – Homologação 1º grau – Atualização de Versão",
    "Pje-JT – Homologação 2º grau – Atualização de Versão",
    "Pje-JT – Incidentes – Atualização de dados/versão",
    "Pje-JT – Produção 1º grau – Atualização de Versão",
    "Pje-JT – Produção 2º grau – Atualização de Versão",
    "Pje-JT – Treinamento 1º grau – Copiar dados/versão da produção",
    "Pje-JT – Treinamento 1º grau – Guardar cópia (fazer backup)",
    "Pje-JT – Treinamento 1º grau – Restaurar cópia (voltar backup)",
    "Pje-JT – Treinamento 2º grau – Copiar dados/versão da produção",
    "Pje-JT – Treinamento 2º grau – Guardar cópia (fazer backup)",
    "Pje-JT – Treinamento 2º grau – Restaurar cópia (voltar backup)",
    "PJE – Erro de acesso",
    "PJE 2º Grau – Produção – Alteração do Cadastro de Parte",
    "PJE 2º Grau – Produção – Alteração Órgãos Julgadores",
    "Peticionamento Avulso – Erro",
    "Pesquisa de Log – 2º Grau",
    "Pesquisas – Erro",
    "Perito – Erro ao Anexar Laudo",
    "Perito – Perícia Designada – Processo não Localizado no Painel",
    "Plantonista – Exclusão de Magistrados do OJ",
    "Plantonista – Usuário Sem Visibilidade",
    "Prazo em Aberto – Erro",
    "Prazo em Aberto – Erro ao Encerrar Expediente",
    "Processo – Bloqueado",
    "Processo – CHIPS – Erro de Registro",
    "Processo – Consulta a Dados do Processo",
    "Processo – Consulta – Erro ao Abrir",
    "Processo – Erro na Autuação",
    "Processo – Erro na Distribuição – Ausência de Petição Inicial",
    "Processo – Erro na Distribuição – Processo sem Número",
    "Processo – Localização – Não Encontrado",
    "Processo – Movimentos – Regularização ou Inclusão",
    "Processo – Registro de Valores – Correção de Erro",
    "PUSH – Erro",
    "Revisor – Erro ao Encaminhar",
    "Registros – Erro",
    "Redistribuição – Documento Não Assinado",
    "Redistribuição – Erro",
    "Remessa ao 2º Grau – Erro",
    "Remessa ao TST – Erro",
    "Remessa ao TST – Erro na Elaboração da Certidão de Remessa",
    "Retificação de Autuação – Erro",
    "SAO – Erro na Emissão de Relatório",
    "Sentença – Erro em Assinatura",
    "Sentença – Registro de Solução – Erro na Inclusão",
    "Sentença – Resultados – Alteração dos Dados",
    "SIF – Erro de Acesso / Execução",
    "SISCONDJ – Erro de Acesso / Execução",
    "Sistema – Correção / Inclusão de Dados",
    "Subcaixas – Problemas com Manutenção",
    "Tarefa – Análise de Dependência",
    "Tarefa – Apreciar Petição – Erro",
    "Tarefa – Arquivamento – Erro",
    "Tarefa – Comunicação de Ato – Erro na Assinatura",
    "Tarefa – Comunicação de Ato – Erro na Execução",
    "Tarefa – Conclusão ao Magistrado",
    "Tarefa – Conversão em Diligência – Erro na Movimentação",
    "Tarefa – Desarquivar – Erro",
    "Tarefa – Erro de fase",
    "Tarefa – Erro de Fluxo",
    "Tarefa – Erro de Movimentação",
    "Tarefa – Erro na Abertura",
    "Tarefa – Erro na Assinatura do Documento",
    "Tarefa – Erro na Execução – Impressão de Expedientes",
    "Tarefa – Erro na Execução – Registro de Depósito / Custas",
    "Tarefa – Erro no Envio de Publicação DEJT",
    "Tarefa – Oficial de Justiça – Erro na Execução",
    "Tarefa – Processo Preso em Publicar DJe",
    "Tarefa – Sem Opções de Tarefa",
    "Tarefa – Trânsito em Julgado",
    "Tarefas – Erro de fase",
    "Tarefas – Sub Caixas",
    "Timeline – Erro na Exibição de Documentos",
    "Unificação de cadastros de órgãos públicos – Erro",
    "Usuário – Acesso Bloqueado – Solicita Desbloqueio",
    "Usuário – Erro de Acesso ao Sistema",
    "Usuário – Recursos do Sistema – Erro de Acesso ou Falta de Autorização",
    "Variáveis – Erro",
    "Variáveis de Documentos – Erro",
    "Votação Antecipada – Erro no Registro",
    "Voto – Erro na Inclusão",
    "Voto – Sem Visibilidade na Pauta de Julgamento"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGrauChange = (value: string) => {
    // Resetar o órgão julgador quando mudar o grau
    setFormData(prev => ({ ...prev, grau: value, orgaoJulgador: "" }));
  };

  const handleTitleChange = (value: string) => {
    console.log("Título selecionado:", value);
    handleInputChange("title", value);
    
    // Buscar template correspondente
    const savedTemplates = localStorage.getItem('ticketTemplates');
    console.log("Templates salvos no localStorage:", savedTemplates);
    
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const template = templates.find((t: any) => t.name === value);
      console.log("Template encontrado:", template);
      if (template) {
        setSelectedTemplate(template);
      } else {
        console.log("Template não encontrado para o título:", value);
        setSelectedTemplate(null);
      }
    } else {
      console.log("Nenhum template salvo no localStorage");
      setSelectedTemplate(null);
    }
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numericValue.length <= 11) {
      return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return numericValue.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    handleInputChange("cpf", formattedCPF);
  };

  const generateTicketText = () => {
    console.log("Iniciando geração do texto JIRA");
    console.log("Dados do formulário:", formData);
    console.log("Template selecionado:", selectedTemplate);

    // Se não há template, vamos criar um texto básico
    if (!selectedTemplate) {
      console.log("Criando texto básico sem template");
      
      const basicText = `h2. Informações do Solicitante
*Nome:* ${formData.userName}
*CPF:* ${formData.cpf}
*Perfil:* ${formData.perfil}
*Grau:* ${formData.grau}
*Órgão Julgador:* ${formData.orgaoJulgador}
*Ambiente:* ${formData.environment}
*Prioridade:* ${formData.priority}

h2. Descrição do Problema
*Tipo:* ${formData.type}
*Título:* ${formData.title}

*Descrição Detalhada:*
${formData.description}

h2. Informações Técnicas
*Ambiente:* ${formData.environment}
*Prioridade:* ${formData.priority}`;

      setGeneratedText(basicText);
      setSuggestedQuery("");

      toast({
        title: "Texto gerado!",
        description: "O texto do chamado JIRA foi gerado com sucesso.",
      });
      return;
    }

    // Usar template se disponível
    let jiraText = selectedTemplate.jiraTemplate;
    
    // Substituir variáveis do template
    jiraText = jiraText.replace(/{description}/g, formData.description);
    jiraText = jiraText.replace(/{cpf}/g, formData.cpf);
    jiraText = jiraText.replace(/{userName}/g, formData.userName);
    jiraText = jiraText.replace(/{perfil}/g, formData.perfil);
    jiraText = jiraText.replace(/{grau}/g, formData.grau);
    jiraText = jiraText.replace(/{orgaoJulgador}/g, formData.orgaoJulgador);
    jiraText = jiraText.replace(/{environment}/g, formData.environment);
    jiraText = jiraText.replace(/{priority}/g, formData.priority);

    // Adicionar informações do solicitante
    const solicitanteInfo = `h2. Informações do Solicitante
*Nome:* ${formData.userName}
*CPF:* ${formData.cpf}
*Perfil:* ${formData.perfil}
*Grau:* ${formData.grau}
*Órgão Julgador:* ${formData.orgaoJulgador}
*Ambiente:* ${formData.environment}
*Prioridade:* ${formData.priority}

`;

    const finalText = solicitanteInfo + jiraText;
    
    setGeneratedText(finalText);
    setSuggestedQuery(selectedTemplate.sqlQuery || "");

    console.log("Texto gerado:", finalText);

    toast({
      title: "Texto gerado!",
      description: "O texto do chamado JIRA foi gerado com sucesso.",
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.title || !formData.type || !formData.description || !formData.cpf || !formData.userName || !formData.perfil || !formData.grau || !formData.orgaoJulgador) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Chamado criado!",
      description: "O chamado foi criado com sucesso.",
    });
    
    if (onTicketCreated) {
      onTicketCreated();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">
            {editingTicket ? "Editar Chamado" : "Criar Novo Chamado"}
          </CardTitle>
          <CardDescription>
            Preencha as informações do chamado para gerar automaticamente o texto JIRA e sugestões de queries SQL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Solicitante */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Informações do Solicitante</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nome Completo *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                    placeholder="Ex: João Silva Santos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil *</Label>
                  <Select value={formData.perfil} onValueChange={(value) => handleInputChange("perfil", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {perfis.map((perfil) => (
                        <SelectItem key={perfil.value} value={perfil.value}>
                          {perfil.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grau">Grau *</Label>
                  <Select value={formData.grau} onValueChange={handleGrauChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grau" />
                    </SelectTrigger>
                    <SelectContent>
                      {graus.map((grau) => (
                        <SelectItem key={grau.value} value={grau.value}>
                          {grau.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="orgaoJulgador">Órgão Julgador (OJ) onde trabalha *</Label>
                  {formData.grau === "1grau" ? (
                    <Select value={formData.orgaoJulgador} onValueChange={(value) => handleInputChange("orgaoJulgador", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o órgão julgador" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgaosJulgadores1Grau.map((oj) => (
                          <SelectItem key={oj.codigo} value={`${oj.codigo} - ${oj.nome}`}>
                            {oj.codigo} - {oj.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="orgaoJulgador"
                      value={formData.orgaoJulgador}
                      onChange={(e) => handleInputChange("orgaoJulgador", e.target.value)}
                      placeholder="Ex: TRT da 15ª Região"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações do Chamado */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Detalhes do Chamado</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Chamado *</Label>
                  <Select value={formData.title} onValueChange={handleTitleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto do chamado" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTemplates.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Chamado *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Ambiente</Label>
                  <Select value={formData.environment} onValueChange={(value) => handleInputChange("environment", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ambiente" />
                    </SelectTrigger>
                    <SelectContent>
                      {environments.map((env) => (
                        <SelectItem key={env.value} value={env.value}>
                          {env.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Detalhada *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva detalhadamente o problema, erro ou solicitação..."
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  Inclua o máximo de detalhes possível: mensagens de erro, passos para reproduzir, comportamento esperado, etc.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                type="button" 
                onClick={generateTicketText}
                className="bg-green-600 hover:bg-green-700"
                disabled={!formData.title || !formData.description}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Texto JIRA
              </Button>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTicket ? "Atualizar" : "Criar"} Chamado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {(generatedText || suggestedQuery) && (
        <div className="space-y-6">
          {generatedText && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Texto Gerado para JIRA</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedText, "Texto JIRA")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{generatedText}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {suggestedQuery && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <span>Query SQL Sugerida</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(suggestedQuery, "Query SQL")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">{suggestedQuery}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateTicketForm;
