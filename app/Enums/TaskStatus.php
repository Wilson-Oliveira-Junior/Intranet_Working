<?php

namespace App\Enums;

enum TaskStatus: string
{
    case OPEN = 'aberto';
    case WORKING = 'trabalhando';
    case CLOSED = 'fechado';
}
