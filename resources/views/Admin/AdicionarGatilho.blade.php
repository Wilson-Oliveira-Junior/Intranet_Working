<form action="{{ route('admin.gatilhos.salvar') }}" method="POST">
    @csrf
    <div class="form-group">
        <label for="gatilho">Gatilho</label>
        <input type="text" class="form-control" id="gatilho" name="gatilho" required>
    </div>
    <div class="form-group">
        <label for="id_tipo_projeto">Tipo de Projeto</label>
        <select class="form-control" id="id_tipo_projeto" name="id_tipo_projeto" required>
            @foreach($tipos_projetos as $tipo_projeto)
                <option value="{{ $tipo_projeto->id }}">{{ $tipo_projeto->nome }}</option>
            @endforeach
        </select>
    </div>
    <div class="form-group">
        <label for="tipo_gatilho">Tipo de Gatilho</label>
        <select class="form-control" id="tipo_gatilho" name="tipo_gatilho" required>
            <option value="Cliente">Cliente</option>
            <option value="Equipe">Equipe</option>
        </select>
    </div>
    <div class="form-group">
        <label for="dias_limite_padrao">Dias Limite Padrão</label>
        <input type="number" class="form-control" id="dias_limite_padrao" name="dias_limite_padrao" required>
    </div>
    <div class="form-group">
        <label for="dias_limite_50">Dias Limite 50%</label>
        <input type="number" class="form-control" id="dias_limite_50" name="dias_limite_50">
    </div>
    <div class="form-group">
        <label for="dias_limite_40">Dias Limite 40%</label>
        <input type="number" class="form-control" id="dias_limite_40" name="dias_limite_40">
    </div>
    <div class="form-group">
        <label for="dias_limite_30">Dias Limite 30%</label>
        <input type="number" class="form-control" id="dias_limite_30" name="dias_limite_30">
    </div>
    <div class="form-group">
        <label for="id_referente">Referente</label>
        <input type="number" class="form-control" id="id_referente" name="id_referente">
    </div>
    <div class="form-group">
        <label for="id_grupo_gatilho">Grupo de Gatilho</label>
        <select class="form-control" id="id_grupo_gatilho" name="id_grupo_gatilho">
            @foreach($gatilhos_grupos as $grupo)
                <option value="{{ $grupo->id }}">{{ $grupo->descricao }}</option>
            @endforeach
        </select>
    </div>
    <button type="submit" class="btn btn-primary">Salvar</button>
</form>
