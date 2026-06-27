const questions = [
    {
        question: "Qual é o planeta mais quente do sistema solar?",
        options: ["Mercúrio", "Vênus", "Marte", "Júpiter"],
        correct: 1,
        difficulty: "Fácil"
    },
    {
        question: "Em que ano terminou a Segunda Guerra Mundial?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2,
        difficulty: "Fácil"
    },
    {
        question: "Qual é o maior animal terrestre?",
        options: ["Rinoceronte", "Elefante africano", "Hipopótamo", "Girafa"],
        correct: 1,
        difficulty: "Fácil"
    },
    {
        question: "Qual é a capital da Austrália?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correct: 2,
        difficulty: "Fácil"
    },
    {
        question: "Quantos lados tem um hexágono?",
        options: ["5", "6", "7", "8"],
        correct: 1,
        difficulty: "Fácil"
    },
    {
        question: "Qual elemento químico tem o símbolo 'Au'?",
        options: ["Prata", "Alumínio", "Ouro", "Argônio"],
        correct: 2,
        difficulty: "Médio"
    },
    {
        question: "Em que década começou a Revolução Francesa?",
        options: ["1770s", "1780s", "1790s", "1800s"],
        correct: 2,
        difficulty: "Médio"
    },
    {
        question: "Qual é o rio mais longo do mundo?",
        options: ["Amazonas", "Nilo", "Yangtze", "Mississippi"],
        correct: 1,
        difficulty: "Médio"
    },
    {
        question: "Quantos cromossomos tem um ser humano?",
        options: ["23", "46", "48", "52"],
        correct: 1,
        difficulty: "Médio"
    },
    {
        question: "Em que país se localiza a Grande Muralha?",
        options: ["Vietnã", "Mongólia", "China", "Coreia do Norte"],
        correct: 2,
        difficulty: "Fácil"
    },
    {
        question: "Qual é o maior deserto do mundo?",
        options: ["Deserto de Gobi", "Deserto de Kalahari", "Antártida", "Deserto do Saara"],
        correct: 2,
        difficulty: "Médio"
    },
    {
        question: "Quantas cordas tem um violino?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        difficulty: "Médio"
    },
    {
        question: "Em que ano o Titanic naufragou?",
        options: ["1910", "1911", "1912", "1913"],
        correct: 2,
        difficulty: "Fácil"
    },
    {
        question: "Qual é o peixe mais rápido do oceano?",
        options: ["Atum", "Peixe-vela", "Tubarão-branco", "Golfinho"],
        correct: 1,
        difficulty: "Difícil"
    },
    {
        question: "Quantas camadas tem a atmosfera terrestre?",
        options: ["3", "4", "5", "6"],
        correct: 2,
        difficulty: "Difícil"
    },
    {
        question: "Em que ano nasceu Albert Einstein?",
        options: ["1877", "1879", "1881", "1883"],
        correct: 1,
        difficulty: "Difícil"
    },
    {
        question: "Qual é a montanha mais alta do mundo?",
        options: ["K2", "Monte Everest", "Kangchenjunga", "Lhotse"],
        correct: 1,
        difficulty: "Fácil"
    },
    {
        question: "Quantos tentáculos tem um polvo?",
        options: ["6", "8", "10", "12"],
        correct: 1,
        difficulty: "Fácil"
    },
    {
        question: "Qual é o idioma mais falado do mundo?",
        options: ["Espanhol", "Inglês", "Mandarim", "Árabe"],
        correct: 2,
        difficulty: "Médio"
    },
    {
        question: "Em que país ficam as Cataratas do Niágara?",
        options: ["EUA", "Canadá", "EUA e Canadá", "México"],
        correct: 2,
        difficulty: "Fácil"
    },
    {
        question: "Qual é o metal mais precioso do mundo?",
        options: ["Ouro", "Platina", "Paládio", "Rodio"],
        correct: 3,
        difficulty: "Difícil"
    },
    {
        question: "Quantas vezes o coração bate por minuto em repouso?",
        options: ["50-70", "70-100", "100-120", "120-150"],
        correct: 1,
        difficulty: "Médio"
    },
    {
        question: "Em que ano foi inventada a internet?",
        options: ["1969", "1973", "1981", "1989"],
        correct: 3,
        difficulty: "Médio"
    },
    {
        question: "Qual é o planeta com mais luas conhecidas?",
        options: ["Saturno", "Júpiter", "Urano", "Netuno"],
        correct: 1,
        difficulty: "Difícil"
    },
    {
        question: "Quantos ossos tem o corpo humano adulto?",
        options: ["186", "206", "226", "246"],
        correct: 1,
        difficulty: "Médio"
    },
    {
        question: "Qual é a menor unidade de informação em um computador?",
        options: ["Byte", "Kilobyte", "Bit", "Megabyte"],
        correct: 2,
        difficulty: "Médio"
    },
    {
        question: "Em que país nasceu Napoleon Bonaparte?",
        options: ["França", "Itália", "Córsega", "Bélgica"],
        correct: 2,
        difficulty: "Difícil"
    }
];

function getRandomQuestions(count = 1) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
