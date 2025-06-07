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
    { codigo: "1903", nome: "CCP LIMEIRA - Centro de Conciliação Pré Processual" },
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

  // Órgãos Julgadores do 2º Grau
  const orgaosJulgadores2Grau = [
    { codigo: "800", nome: "Assessoria de Precatórios" },
    { codigo: "381", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 8ª Câmara" },
    { codigo: "2", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - 3ª SDI" },
    { codigo: "900", nome: "Gabinete do Plantonista" },
    { codigo: "352", nome: "gab inativo" },
    { codigo: "327", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini - 1ª Câmara" },
    { codigo: "300", nome: "Gabinete de Desembargador Suplente no Órgão Especial 1" },
    { codigo: "301", nome: "Gabinete de Desembargador Suplente no Órgão Especial 2" },
    { codigo: "302", nome: "Gabinete de Desembargador Suplente no Órgão Especial 3" },
    { codigo: "329", nome: "Vaga Aposent. da Desembargadora Vera Teresa Martins Crespo - 1ª Câmara" },
    { codigo: "86", nome: "Vaga Aposent. da Desembargadora Vera Teresa Martins Crespo - 3ª SDI" },
    { codigo: "291", nome: "Vaga Aposent. da Desembargadora Vera Teresa Martins Crespo - 1ª SDI" },
    { codigo: "257", nome: "Gabinete da Vice-Corregedoria Regional - Presidência 2ª SDI" },
    { codigo: "220", nome: "Gabinete da Desembargadora Andrea Guelfi Cunha - Tribunal Pleno" },
    { codigo: "138", nome: "Gabinete da Desembargadora Elency Pereira Neves - 9ª Câmara" },
    { codigo: "407", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - Órgão Especial" },
    { codigo: "127", nome: "Gabinete da Presidência" },
    { codigo: "403", nome: "Gabinete do Desembargador Manoel Carlos Toledo Filho - 3ª SDI" },
    { codigo: "206", nome: "Gabinete da Desembargadora Suzana Monreal Ramos Nogueira - Tribunal Pleno" },
    { codigo: "382", nome: "Gabinete da Desembargadora Gisela Rodrigues Magalhães de Araújo e Moraes - 6ª Câmara" },
    { codigo: "274", nome: "Vaga Aposent. da Desembargadora Elency Pereira Neves - 9ª Câmara" },
    { codigo: "414", nome: "Gabinete da Desembargadora Antonia Sant'Ana - 9ª Câmara" },
    { codigo: "136", nome: "Gabinete do Desembargador Fabio Grasselli - Órgão Especial" },
    { codigo: "408", nome: "Gabinete do Desembargador João Batista da Silva - 9ª Câmara" },
    { codigo: "350", nome: "Gabinete do Desembargador João Batista Martins César - 11ª Câmara" },
    { codigo: "306", nome: "Gabinete do Desembargador João Batista Martins César - Tribunal Pleno" },
    { codigo: "345", nome: "Gabinete do Desembargador Luiz Felipe Paim da Luz Bruno Lobo - 3ª Câmara" },
    { codigo: "77", nome: "Gabinete do Desembargador Ricardo Regis Laraia - 2ª SDI" },
    { codigo: "501", nome: "Gabinete do Desembargador Samuel Hugo Lima - 6ª Câmara" },
    { codigo: "87", nome: "Gabinete do Desembargador Wilton Borba Canicoba - 3ª SDI" },
    { codigo: "29", nome: "Gabinete do Desembargador Wilton Borba Canicoba - 9ª Câmara" },
    { codigo: "221", nome: "Gabinete do Desembargador Luis Henrique Rafael - Tribunal Pleno" },
    { codigo: "19", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - SDC" },
    { codigo: "502", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - 10ª Câmara" },
    { codigo: "324", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - Órgão Especial" },
    { codigo: "377", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - 6ª Câmara" },
    { codigo: "375", nome: "Gabinete da Desembargadora Keila Nogueira Silva - 8ª Câmara" },
    { codigo: "293", nome: "Gabinete da VPJ - SDC Protesto/Oposição" },
    { codigo: "340", nome: "Vaga Aposent. do Desembargador Flavio Nunes Campos - 11ª Câmara" },
    { codigo: "170", nome: "Vaga Aposent. do Desembargador Luis Carlos Candido Martins Sotero da Silva - 8ª Câmara" },
    { codigo: "404", nome: "Gabinete do Desembargador Levi Rosa Tomé - 7ª Câmara" },
    { codigo: "412", nome: "Gabinete do Desembargador Levi Rosa Tomé - 9ª Câmara " },
    { codigo: "409", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - 1ª Câmara" },
    { codigo: "335", nome: "Gabinete do Desembargador Luis Henrique Rafael - 3ª SDI" },
    { codigo: "305", nome: "Gabinete do Juiz do Trabalho Convocado - 9ª Câmara" },
    { codigo: "373", nome: "Gabinete do Desembargador Eder Sivers - 7ª Câmara" },
    { codigo: "278", nome: "Gabinete da Desembargadora Maria Madalena de Oliveira - Órgão Especial" },
    { codigo: "337", nome: "Gabinete de Desembargador Suplente no Órgão Especial 5" },
    { codigo: "328", nome: "Gabinete de Desembargador Suplente no Órgão Especial 6" },
    { codigo: "342", nome: "Gabinete do Desembargador Claudinei Zapata Marques - 1ª Câmara" },
    { codigo: "39", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini - 10ª Câmara" },
    { codigo: "411", nome: "Gabinete da Desembargadora Antonia Sant'Ana - 10ª Câmara" },
    { codigo: "25", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini - 9ª Câmara" },
    { codigo: "81", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini - Órgão Especial" },
    { codigo: "49", nome: "Gabinete do Desembargador João Batista da Silva - 1ª SDI" },
    { codigo: "406", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - 10ª Câmara" },
    { codigo: "901", nome: "Gabinete da Vice-Presidência Judicial" },
    { codigo: "69", nome: "Gabinete do Desembargador Fábio Allegretti Cooper - Órgão Especial" },
    { codigo: "68", nome: "Gabinete do Desembargador Marcos da Silva Porto - Tribunal Pleno" },
    { codigo: "79", nome: "Gabinete do Desembargador Gerson Lacerda Pistori - Tribunal Pleno" },
    { codigo: "61", nome: "Gabinete do Desembargador Manoel Carlos Toledo Filho - Órgão Especial" },
    { codigo: "26", nome: "Gabinete do Desembargador Ricardo Antonio de Plato - 1ª Câmara" },
    { codigo: "105", nome: "Gabinete do Desembargador Ricardo Antonio de Plato - 2ª SDI" },
    { codigo: "176", nome: "Gabinete do Desembargador Ricardo Antonio de Plato - 9ª Câmara" },
    { codigo: "46", nome: "Gabinete do Desembargador Ricardo Antonio de Plato - Tribunal Pleno" },
    { codigo: "41", nome: "Gabinete do Desembargador Ricardo Regis Laraia - 6ª Câmara" },
    { codigo: "47", nome: "Gabinete do Desembargador Ricardo Regis Laraia - Tribunal Pleno" },
    { codigo: "106", nome: "Gabinete do Desembargador Roberto Nóbrega de Almeida Filho - 7ª Câmara" },
    { codigo: "23", nome: "Gabinete do Desembargador Roberto Nóbrega de Almeida Filho - 8ª Câmara" },
    { codigo: "54", nome: "Gabinete do Desembargador Wilton Borba Canicoba - 3ª Câmara" },
    { codigo: "45", nome: "Gabinete do Desembargador Wilton Borba Canicoba - Tribunal Pleno" },
    { codigo: "343", nome: "Gabinete da Desembargadora Thelma Helena Monteiro de Toledo Vieira - 2ª Câmara" },
    { codigo: "294", nome: "Gabinete do Desembargador José Carlos Ábile - 1ª Câmara" },
    { codigo: "145", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - 1ª Câmara" },
    { codigo: "316", nome: "Gabinete do Desembargador José Pedro de Camargo Rodrigues de Souza - 9ª Câmara" },
    { codigo: "11", nome: "Vaga Aposent. do Desembargador José Pedro de Camargo Rodrigues de Souza - 2ª SDI" },
    { codigo: "232", nome: "Gabinete da Desembargadora Maria da Graça Bonança Barbosa - Tribunal Pleno" },
    { codigo: "338", nome: "Gabinete da Desembargadora Maria da Graça Bonança Barbosa - 9ª Câmara" },
    { codigo: "374", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - 11ª Câmara" },
    { codigo: "376", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - Tribunal Pleno" },
    { codigo: "283", nome: "Vaga Aposent. do Desembargador Henrique Damiano - 1ª SDI" },
    { codigo: "22", nome: "Gabinete do Desembargador Claudinei Zapata Marques - 1ª SDI" },
    { codigo: "555", nome: "Gabinete de Desembargador Suplente no Órgão Especial 7" },
    { codigo: "110", nome: "Gabinete de Desembargador Suplente no Órgão Especial 8" },
    { codigo: "307", nome: "Gabinete do Desembargador Carlos Eduardo Oliveira Dias - 6ª Câmara" },
    { codigo: "7", nome: "Gabinete do Desembargador Dagoberto Nishina de Azevedo - 1ª SDI" },
    { codigo: "998", nome: "Gabinete de Desembargador Suplente no Órgão Especial 9" },
    { codigo: "372", nome: "Gabinete do Desembargador Renato Henry Sant'Anna - 4ª Câmara" },
    { codigo: "393", nome: "Gabinete da Desembargadora Andrea Guelfi Cunha - 8ª Câmara " },
    { codigo: "32", nome: "Gabinete do Desembargador Eder Sivers - 2ª SDI" },
    { codigo: "3", nome: "Gabinete do Desembargador Edmundo Fraga Lopes - 3ª SDI" },
    { codigo: "164", nome: "Gabinete do Desembargador Fabio Grasselli - 10ª Câmara" },
    { codigo: "339", nome: "Gabinete do Desembargador Renato Henry Sant'Anna - 6ª Câmara" },
    { codigo: "378", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - 8ª Câmara" },
    { codigo: "67", nome: "Vaga Aposent. do Desembargador Renato Buratto - 2ª SDI" },
    { codigo: "298", nome: "Gabinete do Juiz do Trabalho Convocado - 2ª Câmara" },
    { codigo: "4", nome: "Gabinete do Desembargador Helcio Dantas Lobo Junior - SDC" },
    { codigo: "119", nome: "Gabinete do Juiz do Trabalho Convocado - 4ª Câmara" },
    { codigo: "289", nome: "Gabinete do Juiz do Trabalho Convocado - 5ª Câmara" },
    { codigo: "114", nome: "Gabinete do Juiz do Trabalho Convocado - 8ª Câmara" },
    { codigo: "13", nome: "Gabinete do Desembargador Manoel Carlos Toledo Filho - 2ª SDI" },
    { codigo: "360", nome: "Gabinete da Desembargadora Eleonora Bordini Coca - Órgão Especial" },
    { codigo: "395", nome: "Gabinete do Desembargador José Carlos Ábile - 9ª Câmara" },
    { codigo: "20", nome: "Gabinete da Desembargadora Thelma Helena Monteiro de Toledo Vieira - 1ª SDI" },
    { codigo: "358", nome: "Gabinete da Desembargadora Thelma Helena Monteiro de Toledo Vieira - 1ª Câmara" },
    { codigo: "201", nome: "Gabinete do Desembargador José Carlos Ábile - Tribunal Pleno" },
    { codigo: "295", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - 3ª Câmara" },
    { codigo: "261", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - Tribunal Pleno" },
    { codigo: "162", nome: "Gabinete do Desembargador Fábio Bueno de Aguiar - 11ª Câmara" },
    { codigo: "319", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - 2ª SDI" },
    { codigo: "55", nome: "Gabinete do Desembargador Renato Henry Sant'Anna - 1ª SDI" },
    { codigo: "348", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 4ª Câmara" },
    { codigo: "384", nome: "Gabinete do Desembargador Marcos da Silva Porto - 6ª Câmara" },
    { codigo: "379", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - 5ª Câmara" },
    { codigo: "385", nome: "Gabinete da Desembargadora Rita de Cássia Scagliusi do Carmo - 4ª Câmara" },
    { codigo: "396", nome: "Gabinete do Desembargador Marcos da Silva Porto - 9ª Câmara" },
    { codigo: "394", nome: "Gabinete do Desembargador Renato Henry Sant'Anna - 1ª Câmara" },
    { codigo: "109", nome: "Vaga Aposent. do Desembargador Renato Buratto - 6ª Câmara" },
    { codigo: "177", nome: "Vaga Aposent. do Desembargador Renato Buratto - 7ª Câmara" },
    { codigo: "386", nome: "INATIVADO - " },
    { codigo: "150", nome: "Gabinete da Desembargadora Susana Graciela Santiso - 2ª Câmara" },
    { codigo: "391", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 5ª Câmara" },
    { codigo: "34", nome: "Gabinete da Desembargadora Elency Pereira Neves - 3ª SDI" },
    { codigo: "146", nome: "Gabinete do Desembargador Levi Rosa Tomé - 5ª Câmara" },
    { codigo: "397", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 9ª Câmara" },
    { codigo: "346", nome: "Gabinete do Desembargador Fabio Grasselli - 7ª Câmara" },
    { codigo: "165", nome: "Gabinete do Desembargador Gerson Lacerda Pistori - 9ª Câmara" },
    { codigo: "99", nome: "Gabinete do Desembargador Gerson Lacerda Pistori - SDC" },
    { codigo: "260", nome: "Gabinete da Desembargadora Maria da Graça Bonança Barbosa - 3ª SDI" },
    { codigo: "388", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini 11ª Câmara" },
    { codigo: "254", nome: "Tribunal Pleno - SLAT - Suspensão de Liminar e Antecipação de Tutela" },
    { codigo: "98", nome: "Gabinete da Vice-Presidência Judicial - Inicial DC" },
    { codigo: "341", nome: "Gabinete da Desembargadora Andrea Guelfi Cunha - Órgão Especial " },
    { codigo: "413", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - 4ª Câmara " },
    { codigo: "168", nome: "Gabinete do Desembargador João Alberto Alves Machado - 10ª Câmara" },
    { codigo: "92", nome: "Gabinete do Desembargador João Alberto Alves Machado - SDC" },
    { codigo: "167", nome: "Gabinete do Desembargador José Otávio de Souza Ferreira - 2ª Câmara" },
    { codigo: "73", nome: "Gabinete do Desembargador Roberto Nóbrega de Almeida Filho - 2ª SDI" },
    { codigo: "64", nome: "Gabinete do Desembargador Samuel Hugo Lima - SDC" },
    { codigo: "356", nome: "Gabinete do Desembargador Samuel Hugo Lima - 4ª Câmara " },
    { codigo: "266", nome: "Gabinete do Desembargador Wilton Borba Canicoba - SDC" },
    { codigo: "6", nome: "Gabinete da Desembargadora Ana Paula Pellegrina Lockmann - 1ª SDI" },
    { codigo: "131", nome: "Gabinete da Desembargadora Ana Paula Pellegrina Lockmann - 6ª Câmara" },
    { codigo: "36", nome: "Gabinete da Desembargadora Antonia Regina Tancini Pestana - 2ª SDI" },
    { codigo: "1", nome: "Gabinete da Desembargadora Antonia Regina Tancini Pestana - 6ª Câmara" },
    { codigo: "10", nome: "Gabinete da Desembargadora Eleonora Bordini Coca - 2ª SDI" },
    { codigo: "140", nome: "Gabinete da Desembargadora Eleonora Bordini Coca - 4ª Câmara" },
    { codigo: "142", nome: "Gabinete da Desembargadora Gisela Rodrigues Magalhães de Araújo e Moraes - 5ª Câmara" },
    { codigo: "387", nome: "Gabinete do Desembargador Hélio Grasselli - 11ª Câmara" },
    { codigo: "149", nome: "Gabinete da Desembargadora Rita de Cássia Penkal Bernardino de Souza - 4ª Câmara" },
    { codigo: "152", nome: "Gabinete da Desembargadora Tereza Aparecida Asta Gemignani - 1ª Câmara" },
    { codigo: "153", nome: "Gabinete da Desembargadora Thelma Helena Monteiro de Toledo Vieira - 9ª Câmara" },
    { codigo: "236", nome: "Gabinete do Desembargador Renato Henry Sant'Anna  - Órgão Especial" },
    { codigo: "116", nome: "Gabinete da Vice-Presidência Judicial - Pleno - IUJ/ARG/IRDR" },
    { codigo: "380", nome: "Gabinete da Desembargadora Andrea Guelfi Cunha - 7ª Câmara" },
    { codigo: "139", nome: "Gabinete do Desembargador Jorge Luiz Costa - Órgão Especial" },
    { codigo: "399", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 1ª SDI" },
    { codigo: "371", nome: "Gabinete do Desembargador Marcos da Silva Porto - 7ª Câmara" },
    { codigo: "361", nome: "Gabinete da Desembargadora Erodite Ribeiro dos Santos - Órgão Especial" },
    { codigo: "212", nome: "Gabinete do Desembargador Carlos Augusto Escanfella - Tribunal Pleno" },
    { codigo: "213", nome: "Gabinete do Desembargador Claudinei Zapata Marques - Tribunal Pleno" },
    { codigo: "214", nome: "Gabinete do Desembargador Dagoberto Nishina de Azevedo - Tribunal Pleno" },
    { codigo: "160", nome: "Gabinete do Desembargador Eder Sivers - 11ª Câmara" },
    { codigo: "173", nome: "Gabinete da Desembargadora Antonia Sant'Ana - 7ª Câmara" },
    { codigo: "364", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - 4ª Câmara" },
    { codigo: "313", nome: "Vaga Aposent. da Desembargadora Suzana Monreal Ramos Nogueira - 1ª Câmara" },
    { codigo: "400", nome: "Gabinete do Desembargador João Alberto Alves Machado - 9ª Câmara" },
    { codigo: "216", nome: "Gabinete do Desembargador Edmundo Fraga Lopes - Tribunal Pleno" },
    { codigo: "401", nome: "Gabinete do Desembargador Samuel Hugo Lima - 9ª Câmara" },
    { codigo: "76", nome: "Gabinete da Desembargadora Rita de Cássia Scagliusi do Carmo - Tribunal Pleno" },
    { codigo: "17", nome: "Gabinete da Desembargadora Antonia Sant'Ana - 1ª SDI" },
    { codigo: "48", nome: "Gabinete do Desembargador Marcos da Silva Porto - 10ª Câmara" },
    { codigo: "50", nome: "Gabinete do Desembargador José Pitas - 3ª Câmara" },
    { codigo: "178", nome: "Gabinete do Desembargador Roberto Nóbrega de Almeida Filho - 6ª Câmara" },
    { codigo: "179", nome: "Gabinete do Desembargador Samuel Hugo Lima - 5ª Câmara" },
    { codigo: "187", nome: "Gabinete da Desembargadora Ana Amarylis Vivacqua de Oliveira Gulla - Tribunal Pleno" },
    { codigo: "190", nome: "Gabinete da Desembargadora Ana Paula Pellegrina Lockmann - Órgão Especial" },
    { codigo: "461", nome: "Gabinete da Desembargadora Antonia Regina Tancini Pestana - 3ª Câmara" },
    { codigo: "268", nome: "Gabinete da Desembargadora Antonia Regina Tancini Pestana - Órgão Especial" },
    { codigo: "193", nome: "Gabinete da Desembargadora Eleonora Bordini Coca - Tribunal Pleno" },
    { codigo: "141", nome: "Gabinete da Desembargadora Erodite Ribeiro dos Santos - 8ª Câmara" },
    { codigo: "195", nome: "Gabinete da Desembargadora Gisela Rodrigues Magalhães de Araújo e Moraes - Tribunal Pleno" },
    { codigo: "196", nome: "Gabinete da Desembargadora Gisela Rodrigues Magalhães de Araújo e Moraes - Órgão Especial" },
    { codigo: "204", nome: "Gabinete da Desembargadora Rita de Cássia Penkal Bernardino de Souza - Tribunal Pleno" },
    { codigo: "205", nome: "Gabinete da Desembargadora Susana Graciela Santiso - Tribunal Pleno" },
    { codigo: "208", nome: "Gabinete da Desembargadora Tereza Aparecida Asta Gemignani - Órgão Especial" },
    { codigo: "209", nome: "Gabinete da Desembargadora Thelma Helena Monteiro de Toledo Vieira - Tribunal Pleno" },
    { codigo: "365", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - 3ª SDI" },
    { codigo: "370", nome: "Gabinete do Desembargador Hélio Grasselli - 1ª Câmara" },
    { codigo: "21", nome: "Gabinete da Desembargadora Keila Nogueira Silva - 1ª SDI" },
    { codigo: "171", nome: "Gabinete do Desembargador Luiz Antonio Lazarim - 1ª Câmara" },
    { codigo: "89", nome: "Gabinete do Desembargador Marcos da Silva Porto - SDC" },
    { codigo: "53", nome: "Gabinete do Desembargador Flavio Nunes Campos - Órgão Especial" },
    { codigo: "250", nome: "Gabinete do Desembargador Manuel Soares Ferreira Carradita - Órgão Especial" },
    { codigo: "16", nome: "Vaga Aposent. do Desembargador Luis Carlos Candido Martins Sotero da Silva - 1ª SDI" },
    { codigo: "121", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - 6ª Câmara" },
    { codigo: "238", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David- Órgão Especial" },
    { codigo: "249", nome: "Gabinete do Desembargador Luis Roberto Nunes - Órgão Especial" },
    { codigo: "227", nome: "Gabinete da Desembargadora Keila Nogueira Silva - Tribunal Pleno" },
    { codigo: "74", nome: "Gabinete do Desembargador Flavio Allegretti de Campos Cooper - Tribunal Pleno" },
    { codigo: "405", nome: "Gabinete do Desembargador Levi Rosa Tomé - 2ª SDI" },
    { codigo: "218", nome: "CEJUSC JT 2º grau - Centro Judiciário de Métodos Consensuais de Solução de Disputa da Justiça do Trabalho" },
    { codigo: "234", nome: "Gabinete do Desembargador Edmundo Fraga Lopes - Órgão Especial" },
    { codigo: "251", nome: "Gabinete do Desembargador Nildemar da Silva Ramos - Órgão Especial" },
    { codigo: "247", nome: "Gabinete do Desembargador Luis Carlos Candido Martins Sotero da Silva - Órgão Especial" },
    { codigo: "192", nome: "Gabinete da Desembargadora Elency Pereira Neves - Tribunal Pleno" },
    { codigo: "183", nome: "Vaga Aposent. da Desembargadora Vera Teresa Martins Crespo - 11ª Câmara" },
    { codigo: "237", nome: "Gabinete do Desembargador Flavio Allegretti de Campos Cooper - Órgão Especial" },
    { codigo: "75", nome: "Gabinete do Desembargador Fábio Bueno de Aguiar - Tribunal Pleno" },
    { codigo: "124", nome: "Gabinete do Desembargador João Alberto Alves Machado - Tribunal Pleno" },
    { codigo: "244", nome: "Gabinete do Desembargador João Alberto Alves Machado - Órgão Especial" },
    { codigo: "242", nome: "Gabinete do Desembargador José Otávio de Souza Ferreira - Órgão Especial" },
    { codigo: "224", nome: "Gabinete da Desembargadora Antonia Sant'Ana - Tribunal Pleno" },
    { codigo: "225", nome: "Gabinete do Desembargador Manoel Carlos Toledo Filho - Tribunal Pleno" },
    { codigo: "229", nome: "Gabinete do Desembargador Roberto Nóbrega de Almeida Filho - Tribunal Pleno" },
    { codigo: "230", nome: "Gabinete do Desembargador Samuel Hugo Lima - Tribunal Pleno" },
    { codigo: "253", nome: "Gabinete do Desembargador Samuel Hugo Lima - Órgão Especial" },
    { codigo: "137", nome: "Gabinete do Desembargador Wilton Borba Canicoba - Órgão Especial" },
    { codigo: "9", nome: "Gabinete da Desembargadora Erodite Ribeiro dos Santos - 1ª SDI" },
    { codigo: "194", nome: "Gabinete da Desembargadora Erodite Ribeiro dos Santos - Tribunal Pleno" },
    { codigo: "129", nome: "Gabinete da Desembargadora Gisela Rodrigues Magalhães de Araújo e Moraes - 3ª SDI" },
    { codigo: "325", nome: "Gabinete da Vice-Presidência Judicial - Análise de Recurso" },
    { codigo: "207", nome: "Gabinete da Desembargadora Tereza Aparecida Asta Gemignani - Tribunal Pleno" },
    { codigo: "123", nome: "Gabinete do Desembargador Luis Henrique Rafael - 11ª Câmara" },
    { codigo: "333", nome: "Gabinete do Desembargador Luis Henrique Rafael - 1ª Câmara" },
    { codigo: "219", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - 1ª Câmara" },
    { codigo: "107", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - Tribunal Pleno" },
    { codigo: "243", nome: "Gabinete do Desembargador José Pitas - Órgão Especial" },
    { codigo: "231", nome: "Gabinete do Desembargador Thomas Malm - Tribunal Pleno" },
    { codigo: "248", nome: "Gabinete do Desembargador Luiz José Dezena da Silva - Órgão Especial" },
    { codigo: "133", nome: "Vaga Aposent. do Desembargador Manuel Soares Ferreira Carradita - 2ª SDI" },
    { codigo: "43", nome: "Gabinete do Juiz do Trabalho Convocado - 1ª Câmara" },
    { codigo: "256", nome: "Gabinete da Corregedoria Regional" },
    { codigo: "65", nome: "Gabinete do Desembargador Levi Rosa Tomé - 3ª SDI" },
    { codigo: "172", nome: "Vaga do Desembargador Luiz José Dezena da Silva - 4ª Câmara" },
    { codigo: "96", nome: "Gabinete da Desembargadora Antonia Sant'Ana - 8ª Câmara" },
    { codigo: "410", nome: "Gabinete do Desembargador Ricardo Regis Laraia - 9ª Câmara" },
    { codigo: "51", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - 8ª Câmara" },
    { codigo: "402", nome: "Gabinete do Desembargador Manoel Carlos Toledo Filho - 5ª Câmara" },
    { codigo: "188", nome: "Gabinete da Desembargadora Ana Maria de Vasconcellos - Tribunal Pleno" },
    { codigo: "233", nome: "Gabinete do Desembargador Claudinei Zapata Marques - Órgão Especial" },
    { codigo: "368", nome: "Gabinete do Desembargador Carlos Eduardo Oliveira Dias - 4ª Câmara" },
    { codigo: "93", nome: "Gabinete do Desembargador Hélio Grasselli - SDC" },
    { codigo: "57", nome: "Gabinete da Desembargadora Helena Rosa Mônaco da Silva Lins Coelho - Órgão Especial" },
    { codigo: "85", nome: "Gabinete da Desembargadora Tereza Aparecida Asta Gemignani - SDC" },
    { codigo: "310", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini - 3ª SDI" },
    { codigo: "331", nome: "Gabinete do Desembargador Edison dos Santos Pelegrini - Tribunal Pleno" },
    { codigo: "132", nome: "Gabinete do Desembargador Gerson Lacerda Pistori - 3ª SDI" },
    { codigo: "290", nome: "Gabinete do Desembargador João Batista Martins César - 3ª SDI" },
    { codigo: "245", nome: "Gabinete do Desembargador Lorival Ferreira dos Santos - Órgão Especial" },
    { codigo: "321", nome: "Gabinete do Desembargador Luiz Felipe Paim da Luz Bruno Lobo - Tribunal Pleno" },
    { codigo: "258", nome: "Gabinete do Desembargador Roberto Nóbrega de Almeida Filho - Órgão Especial" },
    { codigo: "5", nome: "Gabinete da Desembargadora Ana Amarylis Vivacqua de Oliveira Gulla - 1ª SDI" },
    { codigo: "102", nome: "Gabinete da Desembargadora Ana Amarylis Vivacqua de Oliveira Gulla - 3ª Câmara" },
    { codigo: "71", nome: "Gabinete da Desembargadora Ana Amarylis Vivacqua de Oliveira Gulla - Órgão Especial" },
    { codigo: "292", nome: "Gabinete da Desembargadora Ana Paula Pellegrina Lockmann - 3ª SDI" },
    { codigo: "344", nome: "Gabinete da Desembargadora Rita de Cássia Penkal Bernardino de Souza - 1ª Câmara" },
    { codigo: "91", nome: "Gabinete do Desembargador José Carlos Ábile - 3ª Câmara" },
    { codigo: "111", nome: "Gabinete do Desembargador José Pedro de Camargo Rodrigues de Souza - 3ª SDI" },
    { codigo: "186", nome: "Gabinete do Desembargador José Pedro de Camargo Rodrigues de Souza - 8ª Câmara" },
    { codigo: "134", nome: "Gabinete do Desembargador José Pedro de Camargo Rodrigues de Souza - Tribunal Pleno" },
    { codigo: "135", nome: "Gabinete do Desembargador José Pedro de Camargo Rodrigues de Souza - Órgão Especial" },
    { codigo: "100", nome: "Vaga Aposent. do Desembargador José Pedro de Camargo Rodrigues de Souza - 3ª SDI" },
    { codigo: "263", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - 7ª Câmara" },
    { codigo: "215", nome: "Gabinete do Desembargador Eder Sivers - Tribunal Pleno" },
    { codigo: "311", nome: "Gabinete do Desembargador Carlos Eduardo Oliveira Dias - 2ª SDI" },
    { codigo: "222", nome: "Gabinete do Desembargador Renato Henry Sant'Anna - Tribunal Pleno" },
    { codigo: "143", nome: "Gabinete do Desembargador Hélio Grasselli - 2ª Câmara" },
    { codigo: "999", nome: "Gabinete do PLANTÃO JUDICIAL - INATIVADO" },
    { codigo: "174", nome: "Gabinete do Desembargador Manoel Carlos Toledo Filho - 4ª Câmara" },
    { codigo: "199", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - Tribunal Pleno" },
    { codigo: "355", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - 8ª Câmara" },
    { codigo: "42", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - 9ª Câmara" },
    { codigo: "197", nome: "Gabinete do Desembargador Hélio Grasselli - Tribunal Pleno" },
    { codigo: "398", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - 3ª Câmara" },
    { codigo: "273", nome: "Gabinete da Vice-Presidência Judicial - Liminar" },
    { codigo: "299", nome: "Gabinete do Juiz do Trabalho Convocado - 3ª Câmara" },
    { codigo: "94", nome: "Gabinete do Juiz do Trabalho Convocado - 6ª Câmara" },
    { codigo: "180", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - 8ª Câmara" },
    { codigo: "217", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - 2ª Câmara" },
    { codigo: "288", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 2ª SDI" },
    { codigo: "15", nome: "Gabinete do Desembargador João Batista da Silva - 3ª SDI" },
    { codigo: "166", nome: "Gabinete do Desembargador Helcio Dantas Lobo Junior - 3ª Câmara" },
    { codigo: "240", nome: "Gabinete do Desembargador Helcio Dantas Lobo Junior - Órgão Especial" },
    { codigo: "351", nome: "Gabinete do Desembargador João Batista Martins César - SDC" },
    { codigo: "353", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - 1ª Câmara" },
    { codigo: "349", nome: "Gabinete do Desembargador Hélio Grasselli - 6ª Câmara" },
    { codigo: "332", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - Tribunal Pleno" },
    { codigo: "363", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - 11ª Câmara" },
    { codigo: "169", nome: "Gabinete da Desembargadora Andrea Guelfi Cunha - 5ª Câmara" },
    { codigo: "366", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - 2ª SDI" },
    { codigo: "35", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - 3ª SDI" },
    { codigo: "59", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - Tribunal Pleno" },
    { codigo: "148", nome: "Gabinete da Desembargadora Olga Aida Joaquim Gomieri - 11ª Câmara" },
    { codigo: "262", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 1ª Câmara" },
    { codigo: "269", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - Tribunal Pleno" },
    { codigo: "277", nome: "Gabinete da Desembargadora Maria Inês Correa de Cerqueira César Targa - Órgão Especial" },
    { codigo: "389", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 7ª Câmara" },
    { codigo: "354", nome: "Gabinete do Desembargador Hélio Grasselli - Órgão Especial" },
    { codigo: "383", nome: "Gabinete do Desembargador Marcos da Silva Porto - 5ª Câmara" },
    { codigo: "255", nome: "Gabinete da Vice-Presidência Administrativa" },
    { codigo: "228", nome: "Gabinete do Desembargador Renato Buratto - Tribunal Pleno" },
    { codigo: "252", nome: "Gabinete do Desembargador Renato Buratto - Órgão Especial" },
    { codigo: "44", nome: "Gabinete do Desembargador Carlos Eduardo Oliveira Dias - Tribunal Pleno" },
    { codigo: "297", nome: "Credenciamento de Leiloeiros e Corretores" },
    { codigo: "323", nome: "Gabinete do Desembargador Luiz Felipe Paim da Luz Bruno Lobo - 11ª Câmara" },
    { codigo: "562", nome: "Vaga Aposent. do Desembargador José Pedro de Camargo Rodrigues de Souza - 6ª Câmara" },
    { codigo: "303", nome: "Gabinete do Desembargador Paulo Augusto Ferreira - 1ª Câmara" },
    { codigo: "185", nome: "Vaga Aposent. do Desembargador Laurival Ribeiro da Silva Filho - 1ª Câmara" },
    { codigo: "24", nome: "Vaga Aposent. do Desembargador Laurival Ribeiro da Silva Filho - 1ª SDI" },
    { codigo: "103", nome: "Vaga Aposent. do Desembargador Laurival Ribeiro da Silva Filho - SDC" },
    { codigo: "271", nome: "Vaga Aposent. da Desembargadora Elency Pereira Neves - 1ª SDI" },
    { codigo: "270", nome: "Gabinete da Desembargadora Elency Pereira Neves - 1ª SDI" },
    { codigo: "315", nome: "Gabinete do Juiz do Trabalho Convocado - 7ª Câmara" },
    { codigo: "322", nome: "Gabinete do Desembargador Luiz Felipe Paim da Luz Bruno Lobo - 1ª Câmara" },
    { codigo: "309", nome: "Gabinete da Desembargadora Rita de Cássia Penkal Bernardino de Souza - 1ª SDI" },
    { codigo: "304", nome: "Vaga Aposent. do Desembargador Laurival Ribeiro da Silva Filho - 11ª Câmara" },
    { codigo: "367", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - SDC" },
    { codigo: "281", nome: "Gabinete da Desembargadora Thelma Helena Monteiro de Toledo Vieira - Órgão Especial" },
    { codigo: "80", nome: "Gabinete do Desembargador Hélio Grasselli - 2ª SDI" },
    { codigo: "326", nome: "Gabinete do Desembargador Renato Henry Sant'Anna - 9ª Câmara" },
    { codigo: "314", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - 9ª Câmara" },
    { codigo: "318", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 3ª SDI" },
    { codigo: "284", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 4ª Câmara" },
    { codigo: "56", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 6ª Câmara" },
    { codigo: "70", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - SDC" },
    { codigo: "357", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim  - 3ª Câmara" },
    { codigo: "347", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 2ª Câmara" },
    { codigo: "287", nome: "Gabinete do Desembargador João Batista da Silva - 2ª SDI" },
    { codigo: "320", nome: "Gabinete do Desembargador Luiz Felipe Paim da Luz Bruno Lobo - 3ª SDI" },
    { codigo: "282", nome: "Gabinete da Desembargadora Luciane Storer - Órgão Especial" },
    { codigo: "115", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - 3ª SDI" },
    { codigo: "487", nome: "Gabinete do Desembargador Marcelo Garcia Nunes - 8ª Câmara" },
    { codigo: "369", nome: "Gabinete da Desembargadora Mari Angela Pelegrini - 7ª Câmara" },
    { codigo: "275", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 6ª Câmara" },
    { codigo: "336", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 1ª SDI" },
    { codigo: "272", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 3ª SDI" },
    { codigo: "392", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 10ª Câmara" },
    { codigo: "390", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 8ª Câmara" },
    { codigo: "163", nome: "Gabinete da Desembargadora Rita de Cássia Scagliusi do Carmo - 6ª Câmara" },
    { codigo: "312", nome: "Gabinete do Desembargador Eder Sivers - SDC" },
    { codigo: "78", nome: "Gabinete do Desembargador Fabio Grasselli - Tribunal Pleno" },
    { codigo: "181", nome: "Gabinete da Desembargadora Maria da Graça Bonança Barbosa - 10ª Câmara " },
    { codigo: "120", nome: "Gabinete do Juiz do Trabalho Convocado - 10ª Câmara" },
    { codigo: "125", nome: "Gabinete do Desembargador Luis Henrique Rafael - SDC" },
    { codigo: "184", nome: "Vaga Aposent. do Desembargador José Antonio Pancotti - 1ª Câmara" },
    { codigo: "198", nome: "Gabinete da Desembargadora Maria Cecília Fernandes Álvares Leite - Tribunal Pleno" },
    { codigo: "276", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - 1ª Câmara" },
    { codigo: "113", nome: "Gabinete do Juiz do Trabalho Convocado - 11ª Câmara" },
    { codigo: "83", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - Tribunal Pleno" },
    { codigo: "159", nome: "Gabinete do Desembargador Dagoberto Nishina de Azevedo - 4ª Câmara" },
    { codigo: "239", nome: "Gabinete do Desembargador Gerson Lacerda Pistori - Órgão Especial" },
    { codigo: "117", nome: "Gabinete do Desembargador Ricardo Regis Laraia - 10ª Câmara" },
    { codigo: "82", nome: "Gabinete do Desembargador Wilton Borba Canicoba - 2ª Câmara" },
    { codigo: "112", nome: "Gabinete do Desembargador Wilton Borba Canicoba - 2ª SDI" },
    { codigo: "308", nome: "Gabinete da Desembargadora Ana Paula Pellegrina Lockmann - 5ª Câmara" },
    { codigo: "189", nome: "Gabinete da Desembargadora Ana Paula Pellegrina Lockmann - Tribunal Pleno" },
    { codigo: "191", nome: "Gabinete da Desembargadora Antonia Regina Tancini Pestana - Tribunal Pleno" },
    { codigo: "12", nome: "Gabinete da Desembargadora Gisela Rodrigues Magalhães de Araújo e Moraes - 1ª SDI" },
    { codigo: "108", nome: "Gabinete do Desembargador Carlos Eduardo Oliveira Dias - 7ª Câmara" },
    { codigo: "280", nome: "Vaga Aposent. do Desembargador José Pedro de Camargo Rodrigues de Souza - 1ª Câmara" },
    { codigo: "182", nome: "Vaga Aposent. do Desembargador José Pedro de Camargo Rodrigues de Souza - 3ª Câmara" },
    { codigo: "264", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - 2ª SDI" },
    { codigo: "118", nome: "Gabinete da Desembargadora Maria da Graça Bonança Barbosa - 6ª Câmara" },
    { codigo: "126", nome: "Gabinete do Desembargador Fábio Bueno de Aguiar - 1ª Câmara" },
    { codigo: "317", nome: "Gabinete do Desembargador Orlando Amâncio Taveira - 8ª Câmara" },
    { codigo: "175", nome: "Gabinete da Desembargadora Keila Nogueira Silva - 7ª Câmara" },
    { codigo: "226", nome: "Gabinete da Desembargadora Keila Nogueira Silva - Tribunal Pleno" },
    { codigo: "265", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - SDC" },
    { codigo: "128", nome: "Gabinete do Desembargador Hélio Grasselli - 3ª SDI" },
    { codigo: "72", nome: "Gabinete da Desembargadora Rita de Cássia Scagliusi do Carmo - SDC" },
    { codigo: "246", nome: "Gabinete do Desembargador Luiz Antonio Lazarim - Órgão Especial" },
    { codigo: "203", nome: "Gabinete da Desembargadora Olga Aida Joaquim Gomieri - Órgão Especial" },
    { codigo: "27", nome: "Vaga Aposent. do Desembargador Luis Carlos Candido Martins Sotero da Silva - 6ª Câmara" },
    { codigo: "359", nome: "Gabinete da Desembargadora Larissa Carotta Martins da Silva Scarabelim - Órgão Especial" },
    { codigo: "279", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 6ª Câmara" },
    { codigo: "334", nome: "Gabinete de Desembargador Suplente no Órgão Especial 4" },
    { codigo: "285", nome: "Gabinete do Desembargador João Batista da Silva - 1ª Câmara" },
    { codigo: "296", nome: "Gabinete do Desembargador João Batista da Silva - 6ª Câmara" },
    { codigo: "286", nome: "Gabinete do Desembargador João Batista da Silva - SDC" },
    { codigo: "488", nome: "Gabinete do Desembargador João Batista da Silva - 11ª Câmara" },
    { codigo: "154", nome: "Gabinete do Desembargador Antonio Francisco Montanagna - 10ª Câmara" },
    { codigo: "31", nome: "Gabinete do Desembargador Antonio Francisco Montanagna - SDC" },
    { codigo: "210", nome: "Gabinete do Desembargador Antonio Francisco Montanagna - Tribunal Pleno" },
    { codigo: "95", nome: "Gabinete do Desembargador Carlos Alberto Bosco - 1ª SDI" },
    { codigo: "66", nome: "Gabinete do Desembargador Carlos Alberto Bosco - 2ª SDI" },
    { codigo: "104", nome: "Gabinete do Desembargador Carlos Alberto Bosco - 3ª SDI" },
    { codigo: "155", nome: "Gabinete do Desembargador Carlos Alberto Bosco - 7ª Câmara" },
    { codigo: "211", nome: "Gabinete do Desembargador Carlos Alberto Bosco - Tribunal Pleno" },
    { codigo: "330", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - Tribunal Pleno" },
    { codigo: "362", nome: "Gabinete do Desembargador Marcelo Magalhães Rufino - 1ª Câmara" },
    { codigo: "223", nome: "Gabinete do Desembargador João Batista da Silva - Tribunal Pleno" },
    { codigo: "38", nome: "Gabinete da Desembargadora Andrea Guelfi Cunha - SDC" },
    { codigo: "101", nome: "Gabinete da Desembargadora Adriene Sidnei de Moura David - 3ª SDI" },
    { codigo: "486", nome: "Gabinete do Desembargador João Batista da Silva - 8ª Câmara" },
    { codigo: "8", nome: "Gabinete do Desembargador Antonio Francisco Montanagna - 11ª Câmara" },
    { codigo: "158", nome: "Gabinete do Desembargador Claudinei Zapata Marques - 8ª Câmara" },
    { codigo: "200", nome: "Gabinete do Desembargador Levi Rosa Tomé - Tribunal Pleno" },
    { codigo: "157", nome: "Gabinete da Desembargadora Ana Cláudia Torres Vianna - 7ª Câmara" },
    { codigo: "144", nome: "Vaga Aposent. da Desembargadora Maria Cecília Fernandes Álvares Leite - 11ª Câmara" },
    { codigo: "62", nome: "Gabinete do Desembargador José Otávio de Souza Ferreira - 2ª SDI" },
    { codigo: "88", nome: "Gabinete do Desembargador Paulo Augusto Ferreira - 3ª SDI" },
    { codigo: "97", nome: "Gabinete do Desembargador José Otávio de Souza Ferreira - Tribunal Pleno" },
    { codigo: "33", nome: "Vaga Aposent. do Desembargador Carlos Augusto Escanfella - 2ª SDI" },
    { codigo: "130", nome: "Gabinete do Desembargador Carlos Eduardo Oliveira Dias - 5ª Câmara" },
    { codigo: "18", nome: "Vaga Aposent. do Desembargador José Antonio Pancotti - 1ª SDI" },
    { codigo: "30", nome: "Vaga Aposent. da Desembargadora Ana Maria de Vasconcellos - SDC" },
    { codigo: "28", nome: "Vaga Aposent. da Desembargadora Maria Cecília Fernandes Álvares Leite - 10ª Câmara" },
    { codigo: "151", nome: "Vaga Aposent. da Desembargadora Suzana Monreal Ramos Nogueira - 9ª Câmara" },
    { codigo: "202", nome: "Gabinete do Desembargador Paulo Augusto Ferreira - Tribunal Pleno" },
    { codigo: "14", nome: "Gabinete da Desembargadora Rita de Cássia Penkal Bernardino de Souza - 3ª SDI" },
    { codigo: "241", nome: "Gabinete do Desembargador Henrique Damiano - Órgão Especial" },
    { codigo: "63", nome: "Gabinete da Desembargadora Rita de Cássia Penkal Bernardino de Souza - Órgão Especial" },
    { codigo: "52", nome: "Gabinete da Desembargadora Susana Graciela Santiso - 3ª SDI" },
    { codigo: "58", nome: "Gabinete da Desembargadora Susana Graciela Santiso - Órgão Especial" },
    { codigo: "147", nome: "Gabinete do Desembargador José Carlos Ábile - 2ª Câmara" },
    { codigo: "60", nome: "Gabinete do Desembargador José Carlos Ábile - 2ª SDI" },
    { codigo: "40", nome: "Gabinete da Desembargadora Rosemeire Uehara Tanaka - SDC" },
    { codigo: "156", nome: "Gabinete do Desembargador Renan Ravel Rodrigues Fagundes - 3ª SDI" },
    { codigo: "267", nome: "Gabinete do Desembargador Fábio Bueno de Aguiar - 2ª SDI" },
    { codigo: "161", nome: "Gabinete do Desembargador Edmundo Fraga Lopes - 3ª Câmara" },
    { codigo: "235", nome: "Gabinete do Desembargador Eduardo Benedito de Oliveira Zanella - Órgão Especial" },
    { codigo: "37", nome: "Gabinete do Desembargador Fabio Grasselli - 3ª SDI" },
    { codigo: "259", nome: "Gabinete do Desembargador Helcio Dantas Lobo Junior - 3ª SDI" },
    { codigo: "84", nome: "Gabinete do Desembargador Helcio Dantas Lobo Junior - Tribunal Pleno" },
    { codigo: "122", nome: "Gabinete do Desembargador José Pedro de Camargo Rodrigues de Souza - 1ª Câmara" },
    { codigo: "90", nome: "Gabinete da Desembargadora Maria da Graça Bonança Barbosa - SDC" }
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
                  ) : formData.grau === "2grau" ? (
                    <Select value={formData.orgaoJulgador} onValueChange={(value) => handleInputChange("orgaoJulgador", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o órgão julgador" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgaosJulgadores2Grau.map((oj) => (
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
                      placeholder="Selecione primeiro o grau"
                      disabled
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
