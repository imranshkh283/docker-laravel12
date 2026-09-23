<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],   // GET, POST, PUT, DELETE — sab allow

    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],   // Content-Type, Accept, Authorization — sab allow

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
