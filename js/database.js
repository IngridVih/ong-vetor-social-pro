// js/database.js

// Meu "banco de dados" de projetos
export const db = {
    projects: [
        {
            id: 1,
            title: "Arte e Cultura nas Escolas",
            category: "Cultura",
            imgSrc: "img/art_culture.jpg",
            imgWebp: "img/art_culture.webp",
            alt: "Arte e Cultura nas Escolas",
            status: "ativo",
            description: "O projeto Arte e Cultura nas Escolas leva oficinas de música, teatro, dança e artes visuais para escolas públicas, despertando a criatividade e o senso crítico dos estudantes. A iniciativa valoriza a expressão artística como ferramenta de aprendizado, inclusão, fortalecimento da identidade cultural e conhecimento do seu eu.",
            progress: 60,
            raised: "R$ 89.750",
            goal: "R$ 120.000",
            volunteers: "1/12",
            endDate: "30/11/2024",
            author: "Luiza Fernandes"
        },
        {
            id: 2,
            title: "Saúde Mental na Comunidade",
            category: "Saúde",
            icon: "fa-briefcase-medical",
            imgSrc: "img/saude_mental.jpg",
            imgWebp: "img/saude_mental.webp",
            alt: "Saúde Mental",
            status: "ativo",
            description: "O projeto Saúde Mental na Comunidade oferece apoio psicológico gratuito para famílias em situação de vulnerabilidade. Por meio de atendimentos individuais, rodas de conversa e oficinas de bem-estar, busca fortalecer vínculos, promover o autocuidado e combater o estigma em torno da saúde emocional.",
            progress: 60,
            raised: "R$ 45.300",
            goal: "R$ 75.000",
            volunteers: "18/20",
            endDate: "31/10/2025",
            author: "Dr. João Santos"
        },
        {
            id: 3,
            title: "Educação Digital para Todos",
            category: "Educação",
            icon: "fa-laptop-code",
            imgSrc: "img/educacao_digital.jpg",
            imgWebp: "img/educacao_digital.webp",
            alt: "Educação Digital",
            status: "ativo",
            description: "O programa Educação Digital para Todos leva conhecimento em tecnologia a comunidades com pouco acesso à informação. Oferece cursos gratuitos de informática básica e cidadania digital, preparando jovens e adultos para o mercado de trabalho e fortalecendo a inclusão social através da educação.",
            progress: 65,
            raised: "R$ 32.500",
            goal: "R$ 50.000",
            volunteers: "12/15",
            endDate: "31/12/2025",
            author: "Carolina Silva"
        },
        {
            id: 4,
            title: "Horta Comunitária",
            category: "Meio Ambiente",
            icon: "fa-tree",
            imgSrc: "img/hortas_comunitarias.jpg",
            imgWebp: "img/hortas_comunitarias.webp",
            alt: "Horta Comunitária",
            status: "ativo",
            description: "O projeto Horta Comunitária incentiva o cultivo coletivo de alimentos orgânicos, fortalecendo laços entre moradores e promovendo alimentação saudável. As hortas servem também como espaços de aprendizado sobre sustentabilidade, agricultura urbana e respeito ao meio ambiente.",
            progress: 40,
            raised: "R$ 4.000",
            goal: "R$ 10.000",
            volunteers: "8/10",
            endDate: "20/12/2025",
            author: "Robson Pereira"
        },
        {
            id: 5,
            title: "Alimentação Solidária",
            category: "Assistência Social",
            icon: "fa-hand-holding-heart",
            imgSrc: "img/alimentacao.jpg",
            imgWebp: "img/alimentacao.webp",
            alt: "Alimentação Solidária",
            status: "ativo",
            description: "O programa Alimentação Solidária oferece refeições nutritivas todos os dias para pessoas em situação de rua, acompanhadas de escuta e orientação social. Além de garantir acesso à alimentação de qualidade, o projeto promove saúde, dignidade e novas possibilidades de reintegração social.",
            progress: 75,
            raised: "R$ 89.750",
            goal: "R$ 120.000",
            volunteers: "28/30",
            endDate: "14/12/2025",
            author: "Carlos Mendes"
        },
        {
            id: 6,
            title: "Reflorestamento Urbano",
            category: "Meio Ambiente",
            icon: "fa-tree",
            imgSrc: "img/reflorestamento_urbano.jpg",
            imgWebp: "img/reflorestamento_urbano.webp",
            alt: "Reflorestamento Urbano",
            status: "planejamento",
            description: "O programa Reflorestamento Urbano atua no plantio de árvores nativas em áreas degradadas das cidades, contribuindo para a recuperação ambiental e o bem-estar coletivo. Além de revitalizar espaços públicos, promove educação ambiental e incentiva a participação da comunidade.",
            progress: 28,
            raised: "R$ 8.500",
            goal: "R$ 30.000",
            volunteers: "5/25",
            endDate: "30/11/2025",
            author: "Marina Costa"
        }
    ],
    testimonials: [
        {
            id: 1,
            quote: "Fazer parte da Vetor Social transformou minha vida. Ver o impacto direto do meu trabalho na comunidade é indescritível.",
            imgSrc: "img/maria_silva.jpg",
            imgWebp: "img/maria_silva.webp",
            author: "Maria Silva",
            role: "Voluntária há 3 anos"
        },
        {
            id: 2,
            quote: "A organização e o profissionalismo da equipe fazem toda a diferença. Juntos, conseguimos muito mais, é incrível fazer parte disso.",
            imgSrc: "img/ana_costa.jpg",
            imgWebp: "img/ana_costa.webp",
            author: "Ana Costa",
            role: "Voluntária de Meio Ambiente"
        },
        {
            id: 3,
            quote: "Ensinar crianças e ver seus olhos brilhando com o aprendizado é a maior recompensa que posso ter. Amo fazer parte disso.",
            imgSrc: "img/joana_santos.jpg",
            imgWebp: "img/joana_santos.webp",
            author: "Joana Santos",
            role: "Voluntária da Educação"
        }
    ]
};