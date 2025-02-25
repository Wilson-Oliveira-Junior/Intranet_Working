<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\GatilhoTemplate;
use App\Models\TipoProjeto;
use App\Models\GatilhoGrupo;
use Illuminate\Support\Facades\DB;
use App\Models\ComentarioProjeto;
use App\Models\GatilhoProjeto;
use App\Models\Projeto;
use App\Models\GatilhoAdiamento;
use App\Services\GatilhoService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\GatilhosAvisos;
use App\Models\Client;
use Illuminate\Support\Facades\Log;
use App\Models\Comment;

class GatilhoController extends Controller
{
    protected $gatilhoService;

    public function __construct(GatilhoService $gatilhoService)
    {
        $this->gatilhoService = $gatilhoService;
    }

    public function getGatilhosData()
    {
        $clients = Client::where('status', 'Ativo')->get();
        $projectTypes = TipoProjeto::all();
        $user = Auth::user();
        $arrGatilhos = DB::table('tb_gatilhos_templates')
            ->leftJoin('tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id',
                'tb_gatilhos_templates.gatilho',
                'tb_gatilhos_templates.dias_limite_padrao',
                'tb_gatilhos_templates.dias_limite_50',
                'tb_gatilhos_templates.dias_limite_40',
                'tb_gatilhos_templates.dias_limite_30',
                'tb_gatilhos_templates.tipo_gatilho',
                'tipo_projetos.id as id_tipo_projeto',
                'tipo_projetos.nome as nome_tipo_projeto'
            )
            ->get();

        return Inertia::render('Admin/Gatilhos', [
            'clients' => $clients,
            'projectTypes' => $projectTypes,
            'user' => $user,
            'arrGatilhos' => $arrGatilhos,
        ]);
    }

    public function indexGatilhos()
    {
        $gatilhos = DB::table('tb_gatilhos_templates')
            ->leftJoin('tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tipo_projetos.id')
            ->select(
                'tipo_projetos.id as id_tipo_projeto',
                'tipo_projetos.nome as nome_tipo_projeto',
                DB::raw("(SELECT SUM(1) FROM tb_gatilhos_templates
                    WHERE tb_gatilhos_templates.id_tipo_projeto = tipo_projetos.id) as num_gatilhos"),
                DB::raw("(SELECT SUM(1) FROM tb_gatilhos_templates
                    WHERE tb_gatilhos_templates.id_tipo_projeto = tipo_projetos.id
                    AND tb_gatilhos_templates.tipo_gatilho = 'Equipe') as num_equipe"),
                DB::raw("(SELECT SUM(1) FROM tb_gatilhos_templates
                    WHERE tb_gatilhos_templates.id_tipo_projeto = tipo_projetos.id
                    AND tb_gatilhos_templates.tipo_gatilho = 'Cliente') as num_cliente")
            )
            ->groupBy(
                'tipo_projetos.id',
                'tipo_projetos.nome'
            )
            ->get();

        return Inertia::render('Admin/Gatilhos', compact('gatilhos'));
    }

    public function templateGatilhos($id)
    {
        $gatilhos = DB::table('tb_gatilhos_templates')
            ->where('tb_gatilhos_templates.id_tipo_projeto', '=', $id)
            ->leftJoin('tb_tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tb_tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id',
                'tb_gatilhos_templates.gatilho',
                'tb_gatilhos_templates.dias_limite_padrao',
                'tb_gatilhos_templates.dias_limite_50',
                'tb_gatilhos_templates.dias_limite_40',
                'tb_gatilhos_templates.dias_limite_30',
                'tb_gatilhos_templates.tipo_gatilho',
                'tb_tipo_projetos.id as id_tipo_projeto',
                'tb_tipo_projetos.nome as nome_tipo_projeto'
            )
            ->paginate(20);

        return Inertia::render('Admin/TemplateGatilhos', compact('gatilhos'));
    }

    public function adicionarGatilho()
    {
        $gatilhos = GatilhoTemplate::all();
        $id_ref = GatilhoTemplate::leftJoin('tb_tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tb_tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id as id_gatilho_template',
                'tb_gatilhos_templates.gatilho as nome_gatilho',
                'tb_tipo_projetos.nome as nome_projeto'
            )
            ->get();

        $gatilhos_grupos = GatilhoGrupo::all();
        $tipos_projetos = TipoProjeto::orderBy('nome', 'asc')->get();

        return Inertia::render('Admin/AdicionarGatilho', compact('gatilhos', 'gatilhos_grupos', 'tipos_projetos', 'id_ref'));
    }

    public function salvarGatilho(Request $request)
    {
        $dados = $request->all();

        $gatilhos = new GatilhoTemplate();
        $gatilhos->gatilho = $dados['gatilho'];
        $gatilhos->id_tipo_projeto = $dados['id_tipo_projeto'];
        $gatilhos->tipo_gatilho = $dados['tipo_gatilho'];
        $gatilhos->dias_limite_padrao = $dados['dias_limite_padrao'];
        $gatilhos->dias_limite_50 = $dados['dias_limite_50'];
        $gatilhos->dias_limite_40 = $dados['dias_limite_40'];
        $gatilhos->dias_limite_30 = $dados['dias_limite_30'];
        $gatilhos->id_referente = $dados['id_referente'];
        $gatilhos->id_grupo_gatilho = $dados['id_grupo_gatilho'];
        $gatilhos->save();

        return redirect()->route('admin.gatilhos')->with('successMessage', 'Gatilho adicionado com sucesso.');
    }

    public function editarGatilho($id)
    {
        $gatilhos = GatilhoTemplate::find($id);
        $id_ref = GatilhoTemplate::leftJoin('tb_tipo_projetos', 'tb_gatilhos_templates.id_tipo_projeto', '=', 'tb_tipo_projetos.id')
            ->select(
                'tb_gatilhos_templates.id as id_gatilho_template',
                'tb_gatilhos_templates.gatilho as nome_gatilho',
                'tb_tipo_projetos.nome as nome_projeto'
            )
            ->get();
        $gatilhos_grupos = GatilhoGrupo::all();
        $tipos_projetos = TipoProjeto::orderBy('nome', 'asc')->get();

        return Inertia::render('Admin/EditarGatilho', compact('gatilhos', 'gatilhos_grupos', 'tipos_projetos', 'id_ref'));
    }

    public function atualizarGatilho(Request $request, $id)
    {
        $gatilhos = GatilhoTemplate::find($id);
        $dados = $request->all();

        $gatilhos->gatilho = $dados['gatilho'];
        $gatilhos->id_tipo_projeto = $dados['id_tipo_projeto'];
        $gatilhos->tipo_gatilho = $dados['tipo_gatilho'];
        $gatilhos->dias_limite_padrao = $dados['dias_limite_padrao'];
        $gatilhos->dias_limite_50 = $dados['dias_limite_50'];
        $gatilhos->dias_limite_40 = $dados['dias_limite_40'];
        $gatilhos->dias_limite_30 = $dados['dias_limite_30'];
        $gatilhos->id_referente = $dados['id_referente'];
        $gatilhos->id_grupo_gatilho = $dados['id_grupo_gatilho'];
        $gatilhos->update();

        return redirect()->route('admin.gatilhos.editar', $gatilhos->id)->with('successMessage', 'Gatilho editado com sucesso.');
    }

    public function deletarGatilho($id)
    {
        GatilhoTemplate::find($id)->delete();
        return redirect()->route('admin.gatilhos')->with('successMessage', 'Gatilho deletado com sucesso.');
    }

    public function geral()
    {
        $tipoprojetos = TipoProjeto::where('status', 'Ativo')->orderBy('nome', 'ASC')->get();
        $projetosgatilhos = GatilhoProjeto::with('projetos')->orderBy('id_projeto', 'ASC')->get();

        return view('backend.gatilhos.geral.index', compact('tipoprojetos', 'projetosgatilhos'));
    }

    public function atualizaStatusGatilhos()
    {
        try {
            $atu = $this->gatilhoService->atualizaStatusGatilhos();
            Log::info('Status dos gatilhos atualizado com sucesso.', ['result' => $atu]);
            return response()->json(['message' => 'Status dos gatilhos atualizado com sucesso.', 'result' => $atu]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar status dos gatilhos.', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao atualizar status dos gatilhos.', 'error' => $e->getMessage()], 500);
        }
    }

    public function pausarProjeto(Request $request)
    {
        $dados = $request->all();

        $projeto = GatilhoProjeto::where('id_projeto', $dados['id_projeto'])->first();

        if ($projeto->status == 'E') {
            $projeto->status = 'P';
        } else {
            $projeto->status = 'E';
        }
        $projeto->save();

        return response()->json($projeto);
    }

    public function filtrarGatilhos(Request $request)
    {
        $dados = $request->all();

        $blIdTipoProjeto = (is_null($dados['idtipoprojeto'])) ? null : $dados['idtipoprojeto'];
        $blIdProjeto = (is_null($dados['idcliente'])) ? null : $dados['idcliente'];

        $arrGatilhos = $this->gatilhoService->fnListarGatilhos($blIdTipoProjeto, $blIdProjeto, $dados['status']);
        return view('backend.gatilhos.geral.filtro', compact('arrGatilhos'));
    }

    public function ultimoComentarioProjeto($id_projeto)
    {
        $comentario = Comment::where('task_id', $id_projeto)
            ->orderBy('id', 'DESC')->first();

        return response()->json(['mensagem' => $comentario], 200);
    }

    public function registrarComentarioProjeto(Request $request)
    {
        $dados = $request->all();

        $insComentario = new Comment();
        $insComentario->user_id = Auth::id();
        $insComentario->task_id = $dados['idprojeto'];
        $insComentario->text = $dados['comentario'];
        $insComentario->date = Carbon::now();
        $insComentario->save();

        return response()->json($insComentario);
    }

    public function projeto($id_projeto)
    {
        $projetoatual = Projeto::find($id_projeto);

        $gatilhos = DB::table('tb_gatilhos')
            ->where('tb_gatilhos.id_tipo_projeto', '=', $id_projeto)
            ->leftJoin('tb_gatilhos_templates', 'tb_gatilhos.id_gatilho_template', '=', 'tb_gatilhos_templates.id')
            ->leftJoin('users', 'tb_gatilhos.id_usuario', '=', 'users.id')
            ->select(
                'tb_gatilhos.id',
                'tb_gatilhos.id_tipo_projeto',
                'tb_gatilhos.status',
                'tb_gatilhos.data_conclusao',
                'tb_gatilhos.data_limite',
                'tb_gatilhos.created_at',
                'tb_gatilhos.bkp_data_origem',
                'tb_gatilhos_templates.gatilho',
                'users.name',
                'users.sobrenome'
            )
            ->orderby('tb_gatilhos.id', 'asc')
            ->get();

        $numero_gatilho_aberto = DB::table('tb_gatilhos')->where('tb_gatilhos.id_tipo_projeto', '=', $id_projeto)->count();
        $numero_gatilho_entregue = DB::table('tb_gatilhos')->where('tb_gatilhos.id_tipo_projeto', '=', $id_projeto)->where('status', '=', 'Finalizado')->count();
        $data_gatilho_criado = DB::table('tb_gatilhos')->where('tb_gatilhos.id_tipo_projeto', '=', $id_projeto)->value('tb_gatilhos.created_at');

        if ($projetoatual->data_referencia) {
            $formatar_data = date('Y-m-d', strtotime($projetoatual->data_referencia));
        } else {
            $formatar_data = date('Y-m-d', strtotime($data_gatilho_criado));
        }

        $prazo = ($projetoatual->prazo > 0) ? $projetoatual->prazo : 65;
        $data_fim_projeto = Carbon::parse($formatar_data)->addWeekdays($prazo);

        $dias_passados = $data_fim_projeto->diffInWeekdays($formatar_data);

        $hoje = Carbon::today();
        $auxiliar = $data_fim_projeto->diffInWeekdays($hoje);
        $dias_passados_2 = $dias_passados - $auxiliar;
        if ($projetoatual->data_referencia) {
            $dataInicio = Carbon::parse($projetoatual->data_referencia);
        } else {
            $dataInicio = Carbon::parse($data_gatilho_criado);
        }
        $diasPassados = $dataInicio->diffInWeekdays($hoje);

        $projeto = DB::table('tb_projetos')->where('tb_projetos.id', '=', $id_projeto)
            ->leftJoin('clientes', 'tb_projetos.cliente_id', '=', 'clientes.cliente_id')
            ->Select(
                'tb_projetos.projeto',
                'clientes.nome',
                'clientes.nome_fantasia'
            )
            ->get();

        $comentarios = Comment::where('task_id', '=', $id_projeto)
            ->leftjoin('users', 'users.id', '=', 'comments.user_id')
            ->select(
                'users.id as id_usuario',
                'users.name',
                'users.sobrenome',
                'users.image',
                'comments.text as comentario',
                'comments.created_at as data_postagem'
            )
            ->orderBy(
                'comments.created_at', 'desc'
            )
            ->get();

        $id_projeto_oficial = $id_projeto;

        $id_tipo_projeto = DB::table('tb_projetos')->where('tb_projetos.id', '=', $id_projeto_oficial)
            ->join('tb_tipo_projetos', 'tb_projetos.projeto', '=', 'tb_tipo_projetos.nome')
            ->select(
                'tb_tipo_projetos.id'
            )
            ->first();

        $dados_cliente = DB::table('tb_projetos')
            ->where('tb_projetos.id', '=', $id_projeto)
            ->join('clientes', 'tb_projetos.cliente_id', '=', 'clientes.cliente_id')
            ->join('tb_clientes_contatos', 'clientes.id', '=', 'tb_clientes_contatos.id_cliente')
            ->whereIn('tb_clientes_contatos.tipo_contato', ['Responsável do Projeto', 'Responsável Projeto/Financeiro'])
            ->select(
                'tb_clientes_contatos.nome_contato',
                'tb_clientes_contatos.telefone',
                'tb_clientes_contatos.ramal',
                'tb_clientes_contatos.celular',
                'tb_clientes_contatos.email',
                'tb_clientes_contatos.tipo_contato'
            )
            ->get();

        $adiamentos = DB::table('tb_gatilho_adiamento')
            ->where('tb_gatilho_adiamento.id_projeto', '=', $id_projeto)
            ->join('users', 'tb_gatilho_adiamento.id_usuario', '=', 'users.id')
            ->join('tb_gatilhos', 'tb_gatilho_adiamento.id_gatilho', '=', 'tb_gatilhos.id')
            ->join('tb_gatilhos_templates', 'tb_gatilhos.id_gatilho_template', '=', 'tb_gatilhos_templates.id')
            ->select(
                'tb_gatilho_adiamento.data_adiamento',
                'tb_gatilho_adiamento.motivo',
                'tb_gatilho_adiamento.created_at as postado_em',
                'tb_gatilhos_templates.gatilho as nome_gatilho',
                'tb_gatilhos_templates.tipo_gatilho',
                'users.name',
                'users.sobrenome',
                'users.image'
            )
            ->orderby('tb_gatilho_adiamento.id', 'desc')
            ->get();

        $numero_adiamentos = DB::table('tb_gatilho_adiamento')->where('tb_gatilho_adiamento.id_projeto', '=', $id_projeto)->count();
        $numeros_cliente = DB::table('tb_projetos')->where('tb_projetos.id', '=', $id_projeto)->join('clientes', 'tb_projetos.cliente_id', '=', 'clientes.cliente_id')->join('tb_clientes_contatos', 'clientes.id', '=', 'tb_clientes_contatos.id_cliente')->whereIn('tb_clientes_contatos.tipo_contato', ['Responsável do Projeto', 'Responsável Projeto/Financeiro'])->count();
        $numeros_comentario = Comment::where('task_id', '=', $id_projeto)->count();

        return view('backend.gatilhos.projeto.index', compact(
            'comentarios', 'id_projeto_oficial', 'gatilhos', 'projeto',
            'numero_gatilho_aberto', 'numero_gatilho_entregue', 'data_gatilho_criado',
            'data_fim_projeto', 'dias_passados', 'dias_passados_2', 'formatar_data',
            'data_gatilho_criado', 'dados_cliente', 'adiamentos', 'numero_adiamentos',
            'numeros_cliente', 'numeros_comentario', 'auxiliar', 'id_tipo_projeto', 'prazo', 'diasPassados'
        ));
    }

    public function finalizar($id_gatilho, $id_usuario)
    {
        // Get today's date
        $hoje = Carbon::today();

        // Update the "gatilho" status to "Finalizado"
        DB::table('tb_gatilhos')->where('tb_gatilhos.id', '=', $id_gatilho)
            ->update([
                'status' => 'Finalizado',
                'id_usuario' => $id_usuario,
                'data_conclusao' => $hoje,
            ]);

        // Retrieve the project ID
        $projeto = DB::table('tb_gatilhos')->where('tb_gatilhos.id', '=', $id_gatilho)->value('id_tipo_projeto');

        // Retrieve the "gatilho" template ID
        $id_template = DB::table('tb_gatilhos')->where('tb_gatilhos.id', '=', $id_gatilho)->value('id_gatilho_template');

        // Get notification details
        $notificacao = DB::table('tb_gatilhos')
            ->where('tb_gatilhos.id', '=', $id_gatilho)
            ->leftJoin('tb_gatilhos_templates', 'tb_gatilhos.id_gatilho_template', '=', 'tb_gatilhos_templates.id')
            ->leftJoin('tb_gatilhos_grupos', 'tb_gatilhos_templates.id_grupo_gatilho', '=', 'tb_gatilhos_grupos.id')
            ->leftJoin('tb_projetos', 'tb_gatilhos.id_tipo_projeto', '=', 'tb_projetos.id')
            ->leftJoin('clientes', 'tb_projetos.cliente_id', '=', 'clientes.cliente_id')
            ->select(
                'tb_gatilhos.id as id_gatilo',
                'tb_gatilhos.data_conclusao',
                'tb_gatilhos.data_limite',
                'tb_gatilhos_templates.gatilho',
                'tb_projetos.id as id_projeto',
                'tb_projetos.projeto',
                'clientes.id as id_cliente',
                'clientes.nome_fantasia',
                'tb_gatilhos_grupos.email',
                'tb_gatilhos_grupos.email_adicionais'
            )
            ->first();

        // Send notification email
        if ($notificacao) {
            Mail::to($notificacao->email)
                ->cc(explode(',', $notificacao->email_adicionais))
                ->send(new GatilhosAvisos($notificacao));
        }

        return redirect()->route('admin.gatilhos')->with('successMessage', 'Gatilho finalizado com sucesso.');
    }
}
