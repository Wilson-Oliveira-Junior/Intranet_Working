<!DOCTYPE html>
<html>
<head>
    <title>Notificação de Gatilho</title>
</head>
<body>
    <h1>Notificação de Gatilho</h1>
    <p>Olá,</p>
    <p>O gatilho "{{ $notificacao->gatilho }}" do projeto "{{ $notificacao->projeto }}" foi finalizado.</p>
    <p>Data de Conclusão: {{ $notificacao->data_conclusao }}</p>
    <p>Data Limite: {{ $notificacao->data_limite }}</p>
    <p>Cliente: {{ $notificacao->nome_fantasia }}</p>
    <p>Obrigado,</p>
    <p>Equipe</p>
</body>
</html>
