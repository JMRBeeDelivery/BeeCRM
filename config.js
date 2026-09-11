/* =====================================================================
   Ligação com o Supabase.

   Estes dois valores são públicos por natureza: a chave "publishable"
   foi feita para rodar no navegador e sozinha não abre nada — quem
   protege os dados são as políticas de RLS do schema.sql, que exigem
   login e uma linha na tabela "perfis".

   NUNCA coloque aqui a chave "secret" / "service_role". Essa ignora
   todas as políticas de segurança e daria acesso total ao banco a
   quem abrisse o site.
   ===================================================================== */

window.CRM_CONFIG = {
  SUPABASE_URL: "https://ozqxqybcxepjdlhgzokj.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_M8QWDWujKXzWnEXsU8rvgg_-5v9NOkA"
};
