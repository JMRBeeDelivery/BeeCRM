# Hunter de Grandes Contas

CRM de funil para prospecção de grandes contas (redes com múltiplas lojas).
Multiusuário, com login por e-mail e senha e base compartilhada em tempo real:
o que a vendedora salva aparece na tela do gerente em segundos, e vice-versa.

Página única, sem build. Roda em qualquer hospedagem estática — GitHub Pages inclusive.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O CRM inteiro |
| `config.js` | Endereço e chave pública do Supabase — **você preenche** |
| `schema.sql` | Tabelas, permissões e realtime — roda uma vez no Supabase |

---

## Instalação

### 1. Criar o banco

1. Crie uma conta em **supabase.com** e um projeto novo (plano gratuito serve).
   Guarde a senha do banco que ele pedir — não é a senha de login do CRM.
2. No menu lateral, abra **SQL Editor → New query**, cole o conteúdo de `schema.sql`
   inteiro e clique em **Run**. Deve terminar com "Success".

### 2. Fechar o cadastro público

Em **Authentication → Providers → Email**, desligue **Enable sign ups**.
Sem isso qualquer pessoa poderia criar uma conta no seu projeto. Com isso, só o
gerente cria usuários.

### 3. Criar as duas pessoas

Em **Authentication → Users → Add user**, para cada uma:

- E-mail e senha inicial
- Marque **Auto Confirm User** (senão a pessoa não consegue entrar)

Depois volte ao **SQL Editor** e libere o acesso das duas — trocando os e-mails
e nomes pelos reais:

```sql
insert into public.perfis (id, nome, papel)
select id, 'Nome do Gerente', 'gerente' from auth.users
where email = 'gerente@suaempresa.com.br'
on conflict (id) do update set nome = excluded.nome, papel = excluded.papel;

insert into public.perfis (id, nome, papel)
select id, 'Nome da Vendedora', 'hunter' from auth.users
where email = 'vendedora@suaempresa.com.br'
on conflict (id) do update set nome = excluded.nome, papel = excluded.papel;
```

**Criar o usuário não basta.** Quem não tiver linha em `perfis` faz login e não
enxerga nada — a própria tela explica isso e mostra o comando a rodar.

### 4. Ligar o aplicativo ao banco

Em **Project Settings → API**, copie:

- **Project URL** → `SUPABASE_URL`
- Chave **anon public** → `SUPABASE_ANON_KEY`

Cole as duas em `config.js`.

> A chave `anon public` pode ficar no repositório: ela foi feita para rodar no
> navegador e sozinha não abre nada, porque as políticas de RLS exigem login.
> **Nunca** use a chave `service_role` — essa ignora toda a segurança.

### 5. Publicar no GitHub

1. **New repository** no GitHub. Pode ser privado.
2. **Add file → Upload files**: suba `index.html` e `config.js`. Faça o commit.
3. **Settings → Pages**: em *Source*, escolha **Deploy from a branch**,
   branch `main`, pasta `/ (root)`. Salve.
4. Em um ou dois minutos o endereço aparece no topo dessa mesma tela:
   `https://SEU-USUARIO.github.io/NOME-DO-REPO/`

Mande o link para a vendedora. Ela entra com o e-mail e a senha que você criou.

> GitHub Pages é sempre público, mesmo com o repositório privado. Quem abrir o
> link sem senha vê apenas a tela de entrada — os dados estão protegidos pelo
> login e pelas políticas do banco.

---

## Como funciona

### Funil

Prospecção → Conexão → Agendamento → Maturação → Negociação → Alinhamento contratual → Fechamento

Cada etapa tem quatro critérios de saída; a conta só deve avançar quando todos
estiverem cumpridos. A barra no card mostra o quanto já foi marcado.

### O que se registra

- **Conta** — razão social, CNPJ, setor, porte da rede, origem, responsável,
  contato principal e decisor econômico.
- **Dimensionamento do lead** — potencial de entregas por mês, total de lojas da
  rede, praça, temperatura (Quente/Morno/Frio), fit com a operação Bee, sistema de
  integração e raio de entrega. O sistema deriva entregas por loja.
- **Atividades agendadas** — E-mail, Telefonema, Envio de WhatsApp, Reunião e
  Follow-up, com data e hora. Concluir uma atividade grava o resultado no histórico.
- **Histórico** — linha do tempo do que já aconteceu, com o nome de quem registrou.

### Visões

- **Funil** — quadro com arraste entre etapas.
- **Agenda** — pendentes em *Em atraso · Hoje · Próximos 7 dias · Depois*, mais as
  contas em aberto sem nenhuma atividade marcada.
- **Indicadores** — potencial de entregas/mês em aberto e ponderado pela etapa,
  conversão, ciclo médio, lojas em negociação, temperatura e fit, divisão por
  responsável, pendências por tipo, origem e motivos de perda.

Toda soma de volume no sistema — faixa do funil, rodapé das colunas, indicadores —
está em **entregas por mês**.

### Quem vê o quê

Gerente e hunter enxergam e editam **o mesmo funil completo** — é um time de duas
pessoas e ambos precisam da informação inteira. Cada conta tem um responsável, e o
filtro no topo separa a carteira de cada um quando quiser. O papel `gerente` só dá
poder a mais em um ponto: cadastrar novas pessoas na equipe.

### Dados de exemplo

Com o funil vazio aparece um botão para carregar 8 contas fictícias, marcadas com a
etiqueta `exemplo`. Um aviso no topo remove todas em um clique.

---

## Custo

Plano gratuito do Supabase: 500 MB de banco, 50.000 usuários ativos por mês e
200 conexões simultâneas de realtime. Para duas pessoas e alguns milhares de contas,
sobra folga. GitHub Pages é gratuito.

## Identidade visual

Alinhada à Bee Delivery: amarelo `#FFDD00`, grafite `#333333`, fundo `#F1F1F1`,
Roboto e Open Sans. As cores das etapas vão do cinza frio ao ouro da marca conforme
a conta esquenta, fechando em verde.
