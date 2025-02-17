const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   .react()
   .sass('resources/sass/app.scss', 'public/css')
   .styles([
       'resources/css/fixedCommemorativeDates.css',
       // ...outros arquivos CSS...
   ], 'public/css/all.css')
   .version();
