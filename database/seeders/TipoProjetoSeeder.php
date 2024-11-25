<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoProjetoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tipo_projetos')->insert([
            ['nome' => 'Apresentação', 'descricao' => 'Projeto de Apresentação'],
            ['nome' => 'Blogs', 'descricao' => 'Projeto de Blogs'],
            ['nome' => 'Business Manager', 'descricao' => 'Projeto de Business Manager'],
            ['nome' => 'Catálogo(LDCMS)', 'descricao' => 'Projeto de Catálogo(LDCMS)'],
            ['nome' => 'Conteúdo', 'descricao' => 'Projeto de Conteúdo'],
            ['nome' => 'E-mail Marketing', 'descricao' => 'Projeto de E-mail Marketing'],
            ['nome' => 'Facebook', 'descricao' => 'Projeto de Facebook'],
            ['nome' => 'Hora Técnica', 'descricao' => 'Projeto de Hora Técnica'],
            ['nome' => 'Hospedagem', 'descricao' => 'Projeto de Hospedagem'],
            ['nome' => 'Identidade Visual', 'descricao' => 'Projeto de Identidade Visual'],
            ['nome' => 'Implementação RD', 'descricao' => 'Projeto de Implementação RD'],
            ['nome' => 'Impulsionamento', 'descricao' => 'Projeto de Impulsionamento'],
            ['nome' => 'Inbound Marketing', 'descricao' => 'Projeto de Inbound Marketing'],
            ['nome' => 'Instagram Ads', 'descricao' => 'Projeto de Instagram Ads'],
            ['nome' => 'Intranet', 'descricao' => 'Projeto de Intranet'],
            ['nome' => 'Landbot', 'descricao' => 'Projeto de Landbot'],
            ['nome' => 'Landing Page', 'descricao' => 'Projeto de Landing Page'],
            ['nome' => 'LD - Adminsitrativo', 'descricao' => 'Projeto de LD - Adminsitrativo'],
            ['nome' => 'LD - Jobs', 'descricao' => 'Projeto de LD - Jobs'],
            ['nome' => 'LD - Mae', 'descricao' => 'Projeto de LD - Mae'],
            ['nome' => 'LD - Wiki', 'descricao' => 'Projeto de LD - Wiki'],
            ['nome' => 'Linkedin', 'descricao' => 'Projeto de Linkedin'],
            ['nome' => 'Loja Virtual(Magento)', 'descricao' => 'Projeto de Loja Virtual(Magento)'],
            ['nome' => 'Loja Virtual(Oruc)', 'descricao' => 'Projeto de Loja Virtual(Oruc)'],
            ['nome' => 'Loja Virtual(WooCommerce)', 'descricao' => 'Projeto de Loja Virtual(WooCommerce)'],
            ['nome' => 'Manutenção Site', 'descricao' => 'Projeto de Manutenção Site'],
            ['nome' => 'Material Offline', 'descricao' => 'Projeto de Material Offline'],
            ['nome' => 'Multi 360', 'descricao' => 'Projeto de Multi 360'],
            ['nome' => 'One Page(LDCMS)', 'descricao' => 'Projeto de One Page(LDCMS)'],
            ['nome' => 'Pinterest', 'descricao' => 'Projeto de Pinterest'],
            ['nome' => 'Projeto Antigo', 'descricao' => 'Projeto Antigo'],
            ['nome' => 'Redes Sociais', 'descricao' => 'Projeto de Redes Sociais'],
            ['nome' => 'Reponsabilidade Social', 'descricao' => 'Projeto de Reponsabilidade Social'],
            ['nome' => 'SEO', 'descricao' => 'Projeto de SEO'],
            ['nome' => 'Sistema', 'descricao' => 'Projeto de Sistema'],
            ['nome' => 'Sistema Terceirizado', 'descricao' => 'Projeto de Sistema Terceirizado'],
            ['nome' => 'Site(LDCMS)', 'descricao' => 'Projeto de Site(LDCMS)'],
            ['nome' => 'Teaser', 'descricao' => 'Projeto de Teaser'],
            ['nome' => 'Tráfego Pago', 'descricao' => 'Projeto de Tráfego Pago'],
            ['nome' => 'Videos', 'descricao' => 'Projeto de Videos'],
            ['nome' => 'Waze ADS', 'descricao' => 'Projeto de Waze ADS'],
        ]);
    }
}
