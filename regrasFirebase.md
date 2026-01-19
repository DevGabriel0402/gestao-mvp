rules_version = '2';
service cloud.firestore {
    match / databases / { database } / documents {

        /* =========================
           FUNÇÕES AUXILIARES
        ========================== */
        function estaLogado() {
            return request.auth != null;
        }

        function dadosUsuario() {
            return get(/databases/$(database) / documents / usuarios / $(request.auth.uid)).data;
        }

        function usuarioAtivo() {
            return estaLogado() && dadosUsuario().ativo == true;
        }

        function ehAdmin() {
            return usuarioAtivo() && dadosUsuario().papel == "administrador";
        }

        function ehStaffOuAdmin() {
            return usuarioAtivo() &&
                (dadosUsuario().papel == "administrador" || dadosUsuario().papel == "staff");
        }

        /* =========================
           USUÁRIOS (DOC PRINCIPAL)
        ========================== */
        match / usuarios / { uid } {

      // Admin lê qualquer usuário
      // Usuário lê apenas o próprio
      allow read: if ehAdmin() || (estaLogado() && uid == request.auth.uid);

      // Apenas admin gerencia usuários
      allow create, update, delete: if ehAdmin();

            /* =========================
               SUBCOLEÇÕES DO USUÁRIO
               - oficinas
               - configurações
               - alunos
            ========================== */
            match / { subcolecao } / { docId } {

        // Admin lê tudo
        // Usuário lê apenas seus próprios dados
        allow read: if ehAdmin() || (estaLogado() && uid == request.auth.uid);

       // Escrita:
// - Admin pode tudo
// - Usuário pode escrever em: alunos, oficinas, configuracoes
allow create, update: if
  ehAdmin() ||
                    (
                        estaLogado() &&
                        uid == request.auth.uid &&
                        (subcolecao == "alunos" || subcolecao == "oficinas" || subcolecao == "configuracoes")
                    );

// Delete: só admin
allow delete: if ehAdmin();


        // Delete:
        // - Admin pode tudo
        // - Usuário NÃO pode deletar alunos (evita erro)
        allow delete: if ehAdmin();
            }
        }

        /* =========================
           BLOQUEAR COLEÇÕES GLOBAIS
           (já migradas para dentro do usuário)
        ========================== */
        match / alunos / { id } {
      allow read, write: if false;
        }

        match / oficinas / { id } {
      allow read, write: if false;
        }

        match / configuracoes / { id } {
      allow read, write: if false;
        }
    }
}
