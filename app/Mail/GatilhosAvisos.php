<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GatilhosAvisos extends Mailable
{
    use Queueable, SerializesModels;

    public $notificacao;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($notificacao)
    {
        $this->notificacao = $notificacao;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.gatilhos_avisos')
                    ->subject('Notificação de Gatilho')
                    ->with([
                        'notificacao' => $this->notificacao,
                    ]);
    }
}
