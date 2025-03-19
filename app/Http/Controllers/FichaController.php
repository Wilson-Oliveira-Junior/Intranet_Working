<?php

namespace App\Http\Controllers;

use App\Models\TipoProjeto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ficha;
use App\Models\Client;
use App\Models\Projeto;
use App\Models\ClienteContato;
use App\Models\Segmento;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FichaController extends Controller
{
    public function index()
    {
        $fichas = Ficha::all();
        return Inertia::render('Fichas/Index', ['fichas' => $fichas]);
    }

    public function create()
    {
        $segmentos = Segmento::all();
        return Inertia::render('Fichas/Create', ['segmentos' => $segmentos]);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        // Cria a ficha
        $ficha = Ficha::create([
            'nome' => $data['nome'],
            'status' => 'Pendente',
            // Outros campos necessários
        ]);

        // Cria o cliente
        $cliente = Client::create([
            'nome' => $data['nome_cliente'],
            'CNPJ' => $data['cnpj_cpf'],
            'razao_social' => $data['razao_social'],
            'nome_fantasia' => $data['nome_fantasia'],
            'id_segmento' => $data['segmento_empresa'],
            'inscricao_estadual' => $data['inscricao_estadual'],
            'cep' => $data['cep'],
            'endereco' => $data['endereco'],
            'bairro' => $data['bairro'],
            'cidade' => $data['cidade'],
            'estado' => $data['estado'],
            'numero' => $data['numero'],
            'complemento' => $data['complemento'],
            'dia_boleto' => $data['dia_boleto'],
            'observacao_boleto' => $data['observacao_boleto'],
            'nota_fiscal' => $data['nota_fiscal'],
            'telefone' => $data['telefone_cliente'],
            'celular' => $data['celular'],
            'email' => $data['email'],
            // Outros campos necessários
        ]);

        // Cria os contatos do cliente
        foreach ($data['contatos'] as $contato) {
            ClienteContato::create([
                'id_cliente' => $cliente->id,
                'nome_contato' => $contato['nome_contato'],
                'telefone' => $contato['telefone'],
                'celular' => $contato['celular'],
                'email' => $contato['email'],
                'tipo_contato' => $contato['tipo_contato'],
                'ramal' => $contato['ramal'],
            ]);
        }

        // Cria o projeto
        $projeto = Projeto::create([
            'projeto' => $data['tipo_projeto'],
            'ficha_id' => $ficha->id,
            'cliente_id' => $cliente->id,
            // Outros campos necessários
        ]);

        return redirect()->route('fichas.index');
    }

    public function show($id)
    {
        $ficha = Ficha::findOrFail($id);
        return Inertia::render('Fichas/Show', ['ficha' => $ficha]);
    }

    public function approve($id)
    {
        $ficha = Ficha::findOrFail($id);

        // Atualiza o status da ficha
        $ficha->status = 'Autorizada';
        $ficha->aprovado_por = auth()->id();
        $ficha->data_aprovacao = now();
        $ficha->observacao_rejeicao = null; // Limpa a observação em caso de aprovação
        $ficha->save();

        // Adiciona o cliente à base de dados
        $cliente = Client::create([
            'nome' => $ficha->nome_empresa,
            'CNPJ' => $ficha->cnpj,
            'razao_social' => $ficha->nome_empresa,
            'nome_fantasia' => $ficha->nome_empresa,
            'cep' => $ficha->cep,
            'endereco' => $ficha->rua,
            'bairro' => $ficha->bairro,
            'cidade' => $ficha->cidade,
            'estado' => $ficha->estado,
            'telefone' => $ficha->telefone,
            'email' => $ficha->email,
            // Outros campos necessários
        ]);

        // Cria um gatilho para o cliente (exemplo: notificação ou tarefa)
        $this->createClientTrigger($cliente);

        return redirect()->route('fichas.index')->with('success', 'Ficha aprovada e cliente adicionado com sucesso.');
    }

    private function createClientTrigger(Client $cliente)
    {
        // Exemplo de gatilho: criar uma tarefa ou notificação
        Log::info("Gatilho criado para o cliente: {$cliente->nome}");
    }

    public function deny(Request $request, $id)
    {
        $request->validate([
            'observacao_rejeicao' => 'required|string|max:500',
        ]);

        $ficha = Ficha::findOrFail($id);
        $ficha->status = 'Reprovada';
        $ficha->observacao_rejeicao = $request->observacao_rejeicao;
        $ficha->save();

        return redirect()->route('fichas.index')->with('error', 'Ficha reprovada. Observação adicionada.');
    }

    public function buscarDadosEmpresa($cpfCnpj)
    {
        if (strlen($cpfCnpj) === 14) {
            $response = Http::withOptions(['verify' => false])->get("https://www.receitaws.com.br/v1/cnpj/{$cpfCnpj}");
            if ($response->successful()) {
                return response()->json($response->json());
            }
        } else if (strlen($cpfCnpj) === 11) {
            // Handle CPF validation if needed
            return response()->json(['status' => 'CPF válido']);
        }
        return response()->json(['error' => 'Erro ao buscar dados da empresa'], 500);
    }

    public function getSegmentos()
    {
        try {
            $segmentos = Segmento::all(); // Ensure all segments are fetched without pagination
            return response()->json(['data' => $segmentos]); // Return segments within the 'data' property
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao carregar segmentos'], 500);
        }
    }

    public function getTiposProjetos()
    {
        try {
            $tiposprojetos = TipoProjeto::all();
            return response()->json(['data' => $tiposprojetos]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao carregar tipos projetos'], 500);
        }
    }
}
